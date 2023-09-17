from rest_framework.serializers import ModelSerializer, RelatedField
from work.models import Skill, Expertise


class SkillSerializer(ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

    def to_representation(self, instance):
        instance = super(SkillSerializer, self).to_representation(instance)
        if instance["parent"] is None:
            children = Skill.objects.filter(parent_id=instance["id"], active=True).all()
            instance["children"] = SkillSerializer(children, many=True).data
        del instance["parent"]
        return instance


class ExpertiseSerializer(ModelSerializer):
    class Meta:
        model = Expertise
        fields = '__all__'

    def to_representation(self, instance):
        instance = super(ExpertiseSerializer, self).to_representation(instance)
        if instance["parent"] is None:
            children = Expertise.objects.filter(parent_id=instance["id"]).all()
            instance["children"] = SkillSerializer(children, many=True).data
        del instance["parent"]
        return instance
