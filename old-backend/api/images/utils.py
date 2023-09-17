import base64
import datetime
import uuid
from backend.s3_controller import put_file_to_bucket, upload_file_to_bucket


def upload_photo(file, place):
    if not file:
        return None
    else:
        if len(file.split('data:image/')) < 2:
            # That is utl
            return file

    data_time = str(datetime.datetime.now()).split('.')[0]
    salt = str(uuid.uuid4()).split('-')[0]

    file_format = file.split('data:image/')[1].split(';')[0]
    file_name = f'{data_time} {salt}.{file_format}'

    img_data = file.split(';base64,')[1]
    img_data = base64.b64decode(img_data)

    put_file_to_bucket(file_name, img_data, subdir=place)

    return f'/images/{place}/{file_name}'


def upload_file(file, place):
    if not file:
        return None

    data_time = str(datetime.datetime.now()).split('.')[0]
    salt = str(uuid.uuid4()).split('-')[0]

    file_format = file.split('data:image/')[1].split(';')[0]
    file_name = f'{data_time} {salt}.{file_format}'

    img_data = file.split(';base64,')[1]
    img_data = base64.b64decode(img_data)

    put_file_to_bucket(file_name, img_data, subdir=place)

    return {
        "path": f"/images/{place}/{file_name}",
        "file_type": "file",
        "name": file_name
    }
