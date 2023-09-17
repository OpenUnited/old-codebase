#!/usr/bin/env bash
python manage.py migrate
python manage.py flush --no-input
#python manage.py import_csv