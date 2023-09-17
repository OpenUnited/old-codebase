from talent.models import PersonProfile, PersonSkill, Person, PersonWebsite, PersonPreferences


def create_person(person: Person, data: dict, **kwargs) -> None:
    person.first_name = data["first_name"] + " " + data["last_name"]
    person.save()
    person_profile = PersonProfile.objects.create(
        person=person,
        overview=data["bio"],
        avatar_id=data['avatar'] if data['avatar'] != -1 else None
    )
    for skill in data["skills"]:
        PersonSkill.objects.create(
            category=skill["category"],
            expertise=skill["expertise"],
            person_profile=person_profile
        )
    PersonPreferences.objects.create(person=person, **data['preferences'])


def update_person(person: Person, data: dict, **kwargs) -> None:
    person.first_name = data["first_name"] + " " + data["last_name"]
    profile = person.profile.last()
    profile.overview = data["bio"]
    if data['avatar'] > 0:
        profile.avatar_id = data['avatar']
    skills = profile.skills
    skills.clear()
    for skill in data["skills"]:
        skills.create(**skill)
    websites = profile.websites
    websites.clear()
    for website in data["websites"]:
        websites.create(**website)
    preferences = person.preferences.first() if person.preferences.exists() else None
    if not preferences:
        person.preferences.create(**data['preferences'])
    elif data['preferences']:
        for preference_name in data['preferences']:
            setattr(preferences, preference_name, data['preferences'][preference_name])
        preferences.save()
    profile.save()
    person.save()
