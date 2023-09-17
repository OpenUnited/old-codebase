import os
from pathlib import Path

from botocore.exceptions import ClientError
from dotenv import load_dotenv
import boto3


load_dotenv(os.path.join(Path(__file__).resolve().parent.parent, '.env'))
bucket_name = os.environ.get('AWS_BUCKET')

s3 = boto3.resource('s3')


def put_file_to_bucket(file_name, data, subdir):
    file_name = f'{subdir}/{file_name}'
    res = s3.Bucket(bucket_name).put_object(Key=file_name, Body=data)

    return res.__dict__


def upload_file_to_bucket(file_name, file, subdir):
    s3_client = boto3.client('s3')
    try:
        s3_client.upload_file(file, bucket_name, f'{subdir}/{file_name}')
    except ClientError as e:
        print(e, flush=True)
        return False
    return True


def get_file_from_bucket(file_name, subdir):
    file_name = f'{subdir}/{file_name}'
    obj = s3.Object(bucket_name, file_name)

    return obj.get()['Body']
