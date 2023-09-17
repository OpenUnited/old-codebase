Please note, this repo is deprecated. We are moving to [https://github.com/OpenUnited/platform](https://github.com/OpenUnited/platform)


## Getting Started
It is recommended that Python 3.9 is used to run the backend server. Please run the following command first to install all dependencies.
```
pip install -r requirements.txt
```

Before running the server locally, first make a copy of `.env.template` and name it `.env`. Place it in the same directory as the `manage.py` file. Now open the `.env` file with any text editor. This file contains database configuration and license configuration. Please add your local database configuration in the following lines:
```
POSTGRES_USER=dev
POSTGRES_PASSWORD=mypass
POSTGRES_DB=ou_db
POSTGRES_HOST=postgres
POSTGRES_POST=5432
```

The server needs two license files to be present before you can run it. You can find the developer license files in the repository. They are `developer.license` and `developer.license_key.pub`. You need to point to these two files in the `.env` file. Corresponding env variable names are `LICENSE_FILE` and `LICENSE_PUB_KEY`. After you make the changes, the last two lines of your `.env` file should be like this:
```
LICENSE_FILE=developer.license
LICENSE_PUB_KEY=developer.license_key.pub
```

Now save and close the `.env` file. You are now ready to run the backend. First run migration to get the database schemas.
```
python manage.py migrate
```

You can now start the backend server using the command:
```
python manage.py runserver
```

There is a management command to load some dummy data to get you started. The command is:
```
python manage.py dummy_data
```

When developing locally, It is possible to allow a predefined user ID to be used for authentication. This should be used with the fake login settings of the front-end. Please put the same user id in the following field of the .env file:
```
FAKE_LOGIN_USER_ID=YOUR_USER_ID_SAME_AS_FRONTEND
```
