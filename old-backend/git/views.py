import json
import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from work.models import Challenge, Product
from talent.models import Person, ProductPerson
from matching.models import BountyClaim

from github import Github

ENDPOINT = "github/webhook/"


def create_webhook(OWNER, REPO_NAME, token):
    """ Creates a webhook for the specified repository.
    """

    EVENTS = ["push", "pull_request", "issues", "member"]
    HOST = settings.DOMAIN

    config = {"url": "https://{host}/{endpoint}".format(host=HOST, endpoint=ENDPOINT), "content_type": "json"}

    git_access_token = token if token else settings.GIT_ACCESS_TOKEN
    g = Github(git_access_token)
    auth_user = g.get_user()
    if auth_user.login:
        try:
            res = auth_user.create_repo(REPO_NAME)
            repo = g.get_repo("{owner}/{repo_name}".format(owner=OWNER, repo_name=REPO_NAME))
            repo.create_hook("web", config, EVENTS, active=True)
            return res
        except Exception as e:
            return {"error": str(e)}
    return {"error": "authentication token is invalid"}


def create_issue(OWNER, token, repository, title, description, label):
    """ Creates an issue for the specified repository.
    """
    g = Github(token)
    repo_name = repository.split("/")[4]
    repo = g.get_repo("{owner}/{repo_name}".format(owner=OWNER, repo_name=repo_name))
    return repo.create_issue(title=title, body=description, labels=[label])


def handle_tasks(params):
    if params["action"] == "opened":
        pass
    else:
        try:
            challenge = Challenge.objects.get(detail_url=params["issue"]["html_url"])
        except:
            raise Exception("task doesn't exit!")

        try:
            match = BountyClaim.objects.get(Challenge=challenge)
        except:
            raise Exception("match doesn't exit!")

        if params["action"] == "closed":
            match.kind = 1
            match.save()

            challenge.status = 3
            challenge.save()
        elif params["action"] == "assigned":
            match.kind = 2
            match.save()

            try:
                person = Person.objects.get(github_username=params["issue"]["assignee"]["login"])
            except:
                raise Exception("task doesn't exit!")
            match.person = person
            match.save()
        elif params["action"] == "unassigned":
            if match.person is not None and match.person.github_username == params["assignee"]["login"]:
                match.person = None
                match.kind = 0
                match.save()
        elif params["action"] == "labeled":
            label = params["label"]["name"]
        elif params["action"] == "unlabeled":
            label = params["label"]["name"]
        else:
            pass


def handle_contributor(params):
    git_username = params["member"]["login"]
    if params["action"] == "added":
        person, status = Person.objects.get_or_create(first_name=git_username,
                                                      github_username=git_username)

        try:
            product = Product.objects.get(detail_url=params["detail_url"]["html_url"])
        except:
            raise Exception("Product doesn't exit!")

        person, person_status = ProductPerson.objects.get_or_create(person=person, product=product)
        person.right = 2
        person.save()
    elif params["action"] == "removed":
        project_url = params["repository"]["html_url"]
        matches = BountyClaim.objects.filter(person__github_username=git_username,
                                           task__detail_url__contains=project_url)
        matches.update(person=None)
    else:
        print("*** permission_changed ***\n", params)
        pass


@csrf_exempt
def webhook(request):
    res = json.loads(request.body)
    event_type = request.headers["X-Github-Event"]
    # print("~~~~~~~Event Type~~~~~: ", event_type, "\n")
    # print("~~~~~~~Event Body~~~~~: ", res)

    # if event_type == "issues":
    #     print("~~~~~~~~~~~~: ", res)
    #     handle_tasks(res)
    # elif event_type == "member":
    #     handle_contributor(res)
    #     pass
    # else:
    #     print("~~~~~~~Event Type~~~~~: ", event_type, "\n")
    #     print("~~~~~~~Event Body~~~~~: ", res)
    #     pass
    return JsonResponse({"status": True})


def detect_user(request):
    user_id = request.GET.get("user_id", None)

    if user_id is None:
        return JsonResponse({"status": False})
    else:
        try:
            user = Person.objects.get(pk=int(user_id))
            request.session["current_user"] = user.id
            request.user = user

            # authorized_user = AuthorizedUser.objects.first()z
            # authorized_user.user = user
            # authorized_user.save()

            return JsonResponse({
                "status": True,
                "user": {
                    "id": user.id,
                    "emailAddress": user.email_address,
                    "fullName": user.first_name
                }
            })
        except:
            return JsonResponse({"status": False})


def logout(request):
    try:
        authorized_user = request.user
        authorized_user.is_logged = False
        authorized_user.save()
    except Exception as e:
        print(str(e))
        pass
    return JsonResponse({"status": True})
