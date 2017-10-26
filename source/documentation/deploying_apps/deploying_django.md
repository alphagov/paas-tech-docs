## Deploy a Django app

This section explains how to deploy an app using the Django framework. You may also need to refer to the [Cloud Foundry documentation about the Python buildpack](https://docs.cloudfoundry.org/buildpacks/python/index.html) [external link].

Note that the PaaS currently supports the PostgreSQL, MySQL and MongoDB database services. If your Django app requires a database, it must be able to work with one of these.

These steps assume you have already carried out the setup process explained in the [Quick Setup Guide](/#quick-setup-guide) section.

If you are just getting started learning CloudFoundry, you can use the sandbox space by running: ``cf target -s sandbox``

1. Put the code for your Django app into a local directory (for example, by checking it out of version control).

2. If you are using Git, add `*.pyc` and `local_settings.py` to your `.gitignore`, file, then 
   [exclude files ignored by Git](/#excluding-files) so Cloud Foundry will ignore them too.

3. Tell Cloud Foundry which Python runtime to use by creating a `runtime.txt`   file in the root of the local folder. The contents of the file should  
   be:

        python-3.5.1  

    replacing "3.5.1" with the version of Python you want to use (it must be supported by the buildpack: currently versions 2.7.11 to 3.5.2 are supported.)

4. Make sure you have all the required modules for your project installed into your virtual environment (including Django).

1. Generate a ``requirements.txt`` file if your project doesn't already have one by running ``pip freeze > requirements.txt`` in the root of the local folder.
    Add the following lines to the ``requirements.txt`` file.

        whitenoise==1.0.6  #manages static assets
        waitress==0.8.9 #a pure python WSGI server that is a replacement for gunicorn

4. Edit your `wsgi.py` file.

    When you create a Django project, a default `wsgi.py` file should be created for you in the project folder. Excluding the opening comments, the default `wsgi.py` looks like this:

        import os
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PROJECTNAME.settings")

        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        

    You'll need to add a few lines to import the `whitenoise` package and wrap the middleware around the WSGI application so that all static files are served using whitenoise. Edit your `wsgi.py` to:

        import os
        from django.core.wsgi import get_wsgi_application

        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PROJECTNAME.settings")
        # important that the whitenoise import is after the line above
        from whitenoise.django import DjangoWhiteNoise

        application = get_wsgi_application()
        application = DjangoWhiteNoise(application)


    The order here is important. The `DJANGO_SETTINGS_MODULE` environment variable must be set before importing `DjangoWhiteNoise`.

1. You should now tell Django where to look for static files. In `settings.py` within the project folder, add these lines below the ``import os`` statement.

        PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

        STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
        STATIC_URL = '/static/'

    In this case, the STATIC_ROOT variable tells Django to look for static files in a directory called ``static`` inside the project folder, and the STATIC_URL variable sets the path where those files will be served.

    You may need to alter these values depending on how static files are handled in your app.

    If your static files are located across multiple folders, you may need to use the STATICFILES_DIRS variable. See the Django documentation for [full details on managing static files](https://docs.djangoproject.com/en/1.9/howto/static-files/).

1. Create a file called `Procfile` in the root of your local folder, 
   and put in it:
    
            web: python manage.py migrate && waitress-serve --port=$PORT PROJECTNAME.wsgi:application

    The Procfile is a way to specify commands to be run when deploying your app; in this case, for database migration.
        
    `PROJECTNAME` should be replaced with whatever the name of your WSGI module is. By default, this is the same as the name of your project module, but it may be changed using the DJANGO_SETTINGS_MODULE environment variable. Using this configuration will automatically apply any database migrations.

1. Create a `manifest.yml` file in the root of your local folder.

        ---
        applications:
        - name: my-app
          memory: 512M
          buildpack: python_buildpack

    where `my-django-app` is the name that will be used for the app within GOV.UK PaaS.

    Replace ``my-django-app`` with a unique name for your app. (You can use ``cf apps`` to see apps which already exist).

    The `memory` line tells the PaaS how much memory to allocate to the app.

1. If your app requires a database, [create a PostgreSQL backing service and bind it to your app](/#using-postgresql). Then see the section on [PostgreSQL setup](/#postgresql-setup-with-django) below.

1. To push your app, do:

    ``cf push APPNAME``

    from the directory which contains all the code and configuration files.

    If you want to upload the app without starting it (for example, if you need to create a PostgreSQL service), run `cf push --no-start APPNAME`, then when you are ready to start the app, run `cf start APPNAME`.

You can now view your app at `https://APPNAME.cloudapps.digital`.

### PostgreSQL setup with Django

Add these lines to your ``requirements.txt``:

```
psycopg2==2.6.2 #installs the postgres driver
dj-database-url==0.3.0 #grabs environment variables and dumps them into a Django settings file
```

In your `settings.py` file, make sure you import the ``dj_database_url`` package we added to the `requirements.txt` file above:

        import dj_database_url

This package will automatically parse the ``VCAP_SERVICES`` environment variable and set DATABASE_URL to the first database found.

Then you'll need to add a `DATABASES` setting. It's best to add this to the `settings.py` file. 

        DATABASES = {}
        DATABASES['default'] =  dj_database_url.config()

Your `local_settings.py` file will override this when you're working locally.

The `Procfile` configuration provided in the section above will automatically apply database migrations.
