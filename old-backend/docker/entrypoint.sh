#!/bin/bash

set -e

cd /app

/usr/local/bin/python manage.py migrate --no-input
/usr/local/bin/gunicorn -b 0.0.0.0:8000 backend.wsgi
