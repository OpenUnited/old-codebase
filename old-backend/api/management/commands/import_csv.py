# -*- coding: utf-8 -*-
import os
import json
from django.core.management import BaseCommand, call_command
from django.conf import settings

from work.models import *
from talent.models import PersonProfile, Review
from matching.models import TaskClaim
from commercial.models import *

import pandas as pd

def retrieve_file_paths(dirName):
    # setup file paths variable
    filePaths = []

    # Read all directory, subdirectories and file lists
    for root, directories, files in os.walk(dirName):
        for filename in files:
            # Create the full filepath by using os module.
            filePath = os.path.join(root, filename)
            filePaths.append(filePath)

    # return all paths
    return filePaths


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def import_data(self, file_name, row):
        row = { k: None if v == "" or v == None else v for k, v in row.items() }  

        table_type = "".join(x for x in file_name.split("_")[1:])
        if table_type == "Tag".lower():
            Tag.objects.get_or_create(**row)
        if table_type == "Person".lower():
            Person.objects.get_or_create(**row)
        elif table_type == "Product".lower():
            tags = row["tags"].split(",") if row["tags"] != None else []
            row.pop("tags", None)
            prod, status = Product.objects.get_or_create(**row)
            for tag in tags:
                try:
                    prod.tag.add(Tag.objects.get(uuid=tag.strip()))
                except:
                    print("~~~product tag not found~~~: ", tag)
        elif table_type == "Capability".lower():
            if "parent" not in row:
                row["parent"] = None
            elif row["parent"] != None:
                row["parent"] = Capability.objects.get(uuid=row["parent"])
            row["product"] = Product.objects.get(uuid=row["product"])
            Capability.objects.get_or_create(**row)
        elif table_type == "Initiative".lower():
            row["status"] = row["status"] if row["status"] != None else 1
            row["product"] = Product.objects.get(uuid=row["product"])
            Initiative.objects.get_or_create(**row)
        elif table_type == "Task".lower():
            tags = row["tags"].split(",") if row["tags"] != None else []
            depend_on =  row["depend_on"].split(",") if row["depend_on"] != None else []
            row.pop("tags", None)
            row.pop("depend_on", None)

            if row["capability"] !=None:
                row["capability"] = Capability.objects.get(uuid=row["capability"])
            if row["initiative"] !=None:
                row["initiative"] = Initiative.objects.get(uuid=row["initiative"])
            if row["created_by"] != None:
                row["created_by"] = Person.objects.get(uuid=row["created_by"])
                row["updated_by"] = Person.objects.get(uuid=row["updated_by"])
            task, status = Task.objects.get_or_create(**row)
            for tag in tags:
                try:
                    task.tag.add(Tag.objects.get(uuid=tag.strip()))
                except:
                    print("~~~tag not found~~~: ", tag)
            for depend_task in depend_on:
                if depend_task != row["uuid"]:
                    try:
                        task.depend_on.add(Task.objects.get(uuid=depend_task.strip()))
                    except:
                        print("~~~depend_task not found~~~: ", depend_task)
            
        elif table_type == "TaskClaim".lower():
            if row["task"] != None:
                row["task"] = Task.objects.get(uuid=row["task"])
            if row["person"] != None:
                row["person"] = Person.objects.get(uuid=row["person"])
            if row["kind"] == None:
                row["kind"] = 0
            TaskClaim.objects.get_or_create(**row)
        elif table_type == "ProductPerson".lower():
            if row["product"] != None:
                row["product"] = Product.objects.get(uuid=row["product"])
            if row["person"] != None:
                row["person"] = Person.objects.get(uuid=row["person"])
            ProductPerson.objects.get_or_create(**row)
        elif table_type == "PersonProfile".lower():
            if row["person"] != None:
                row["person"] = Person.objects.get(uuid=row["person"])
            PersonProfile.objects.get_or_create(**row)
        elif table_type == "Review".lower():
            if row["product"] != None:
                row["product"] = Product.objects.get(uuid=row["product"])
            if row["initiative"] !=None:
                row["initiative"] = Initiative.objects.get(uuid=row["initiative"])
            if row["person"] != None:
                row["person"] = Person.objects.get(uuid=row["person"])
            if row["created_by"] != None:
                row["created_by"] = Person.objects.get(uuid=row["created_by"])
            Review.objects.get_or_create(**row)
        elif table_type == "Organisation".lower():
            Organisation.objects.get_or_create(**row)
        elif table_type == "Partner".lower():
            if row["product"] != None:
                row["product"] = Product.objects.get(uuid=row["product"])
            if row["organisation"] != None:
                row["organisation"] = Organisation.objects.get(uuid=row["organisation"])
            Partner.objects.get_or_create(**row)
        else:
            pass

    def handle(self, *args, **options):
        # Get csv files only
        csv_files =[]
        prefix_list = []
        file_paths = retrieve_file_paths(f'{settings.BASE_DIR}/fixture')
        for file_path in file_paths:
            extension = os.path.splitext(file_path)[1]
            try:
                if extension.lower() == ".csv":
                    root_path, file_name = os.path.split(file_path)
                    csv_files.append(file_name)
                    prefix_list.append(int(file_name.split("_")[0]))
            except:
                pass

        csv_files.sort()
        prefix_list.sort()

        # Initialize data before importing csv
        default, status = Person.objects.get_or_create(first_name="Default User",
                                                    email_address="default.user@gmail.com")
        # auth_user = AuthorizedUser.objects.get_or_create(user=default)

        # Import data from csv files

        for prefix in prefix_list:
            csv_file = None
            for file in csv_files:
                if str(prefix) in file:
                    csv_file = file

            try:
                df = pd.read_csv(f'{settings.BASE_DIR}/fixture/{csv_file}')
            except Exception as e:
                print(f"{csv_file} is not valid!: ", str(e))

            for index, row in df.iterrows():
                try:
                    self.import_data(csv_file.replace(".csv", ""),
                                    json.loads(row.to_json()))
                except Exception as e:
                    print(f"{csv_file} ERROR reason: ", str(e), "\n")
