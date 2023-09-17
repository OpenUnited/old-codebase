from work.models import Task
import django_filters


class TaskFilter(django_filters.FilterSet):
    # tag = django_filters.CharFilter(lookup_expr=['iexact'])

    class Meta:
        model = Task
        fields = ['status', 'tag']
