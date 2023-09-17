import graphene
from graphene_file_upload.scalars import Upload
from api.images.utils import upload_photo
from api.types import InfoType


class UploadImageMutation(graphene.Mutation, InfoType):
    class Arguments:
        file = Upload(required=True)
        place = graphene.String(required=True)

    url = graphene.String()

    @staticmethod
    def mutate(*args, file, place):
        try:
            url = upload_photo(file, place)

            return UploadImageMutation(url=url, status=True, message='Image has uploaded successfully')
        except:
            return UploadImageMutation(url=None, status=False, message='Error with image uploading')


class ImageMutations(graphene.ObjectType):
    upload_image = UploadImageMutation.Field()
