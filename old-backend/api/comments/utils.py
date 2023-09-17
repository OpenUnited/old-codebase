import re

import notification.tasks
from notification.models import Notification
from talent.models import Person


def create_comment(current_person, comment_input, commented_object, comment_object):
    try:
        if comment_input.parent_id is None:
            parent_id = commented_object.objects.get(pk=comment_input.commented_object_id).comments_start_id

            if not parent_id:
                new_root = comment_object.add_root(text='root')
                updated_object = commented_object.objects.get(pk=comment_input.commented_object_id)
                updated_object.comments_start_id = new_root.id
                updated_object.save()

                parent_id = updated_object.comments_start_id

            parent_node = comment_object.objects.get(pk=parent_id)
        else:
            parent_node = comment_object.objects.get(pk=comment_input.parent_id)

        parent_node.add_child(text=comment_input.text,
                              person_id=current_person.id)

        mentioned_slugs = re.findall("@([\S]+)", comment_input.text)
        receiver_ids = list(Person.objects.filter(user__username__in=mentioned_slugs)
                             .distinct()
                             .values_list("id", flat=True))

        # for task comment, inform all involved person
        if commented_object._meta.model_name == "task":
            task = commented_object.objects.get(pk=comment_input.commented_object_id)
            receiver_ids.append(task.created_by.id)
            receiver_ids.append(task.reviewer.id)
            receiver_ids.append(current_person.id)

        notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                   Notification.EventType.GENERIC_COMMENT,
                                                   receivers=receiver_ids,
                                                   text=comment_input.text)
        return True, "Comment was successfully created"
    except commented_object.DoesNotExist:
        return False, "Commented object doesn't exist"


def resolve_comments(commented_object_id, commented_object, comment_object):
    try:
        node_id = commented_object.objects.get(pk=commented_object_id).comments_start_id

        tree = comment_object.dump_bulk(parent=comment_object.objects.get(pk=node_id))
        tree = tree[0]['children']
        list(map(lambda comment: fetch_tree(comment), tree))

        return tree
    except:
        return None


def fetch_tree(comment):
    try:
        person = Person.objects.get(pk=comment['data']['person'])
        comment['data']['person'] = {'firstName': person.first_name, 'slug': person.user.username}

        if comment['children']:
            list(map(lambda children: fetch_tree(children), comment['children']))
    except:
        pass
