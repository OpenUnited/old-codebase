from notifications.signals import notify


def create_idea_or_bug_history(current_person,
                               input_data,
                               history_model,
                               parent_model,
                               parent_type,
                               mutation):
    status = input_data["status"]
    if status not in range(0, 4):
        return mutation(success=False, message="Not valid status. Available values are 0, 1, 2, 3")
    try:
        parent = parent_model.objects.get(pk=input_data["object_id"])

        if parent.status == status:
            return mutation(success=False, message=f"Please change the {parent_type} status")

        if not parent.product.is_product_member(current_person):
            return mutation(success=False, message=f"You don't have access to change the {parent_type} status")
        data = {
            parent_type: parent,
            "current_status": status,
            "prev_status": parent.status,
            "person": current_person,
            "description": input_data.get("description", None)
        }

        history_model.objects.create(**data)

        return mutation(success=True, message=f"The {parent_type} status was successfully saved")

    except parent_model.DoesNotExist:
        return mutation(success=False, message=f"The {parent_type} doesn't exist")


def vote_to_idea_or_bug(current_person, input_data, vote_model, parent_model, parent_type, mutation):
    vote_type = input_data["vote_type"]
    if vote_type not in [0, 1]:
        return mutation(success=False, message="Not valid vote type. Available values are 0, 1")
    try:
        idea = parent_model.objects.get(pk=input_data["object_id"])
        if current_person == idea.person:
            return mutation(success=False,
                            message=f"You are {parent_type} poster and cannot vote for this {parent_type}")
        data = {
            parent_type: idea,
            "vote_type": vote_type,
            "person": current_person
        }

        if vote_model.objects.filter(**data).exists():
            return mutation(success=False, message=f"You already voted for this {parent_type}")

        vote_model.objects.create(**data)

        return mutation(success=True, message="Your vote successfully saved")

    except parent_model.DoesNotExist:
        return mutation(success=False, message=f"The {parent_type} doesn't exist")
