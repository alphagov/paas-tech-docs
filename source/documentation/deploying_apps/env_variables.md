## Environment variables

You must store all configuration information for your app as environment variables.

This could include:

- credentials for external services that your app uses, for example a Twitter account
- values that will vary with each deployment of the app, for example the canonical URL

To view an app's current environment variables, run `cf env APP_NAME`.

To create or update a variable, run the following:

```
cf set-env APP_NAME ENV_VAR_NAME ENV_VAR_VALUE
```

If you're deploying a pre-existing app, you should check the app's documentation for any environment variables you need to set.

For example, if the app has these instructions for deploying to Heroku:

```
heroku config:set VARIABLE=value
```

then you should run the equivalent command using `cf set-env`:

```
cf set-env APP_NAME VARIABLE value
```

### System-provided environment variables

System-provided environment variables tell you about configuration details handled by the PaaS, for example:

- the port on which the app is listening
- the maximum memory each app instance can use
- the external IP address of the app instance

Do not attempt to change the values of these system-provided variables using the command line or your app's code.

`VCAP_SERVICES` and `VCAP_APPLICATION` are two important variables for initial setup:

- `VCAP_SERVICES` contains details, including credentials, of any backing services bound to the app

- `VCAP_APPLICATION` provides details of the currently running application, for example the language runtime version

To see the values of the system-provided variables, run `cf env APP_NAME`.

If your app connects to a backing service, you may need to have your app parse `VCAP_SERVICES` to get the credentials and other settings relating to that service and set the appropriate environment variables.

Some buildpacks will do this for you automatically. Refer to the deploy instructions for the language or framework you are using for more information.

Here is an example of the structure of the information contained in `VCAP_SERVICES`:

```
{
 "VCAP_SERVICES": {
  "postgres": [
   {
    "binding_name": null,
    "credentials": {
     "host": "rdsbroker-66ecd739-2e98-401a-9e45-15436165be06.c7uewwm9qebj.eu-west-1.rds.amazonaws.com",
     "jdbcuri": "jdbc:postgresql://rdsbroker-66ecd739-2e98-401a-9e45-17938165be06.c7uewwm9qebj.eu-west-1.rds.amazonaws.com:5432/DATABASE_NAME?password=PASSWORD\u0026ssl=true\u0026user=USERNAME",
     "name": "DATABASE_NAME",
     "password": "PASSWORD",
     "port": 5432,
     "uri": "postgres://USERNAME:PASSWORD@rdsbroker-66ecd739-2e98-401a-9e45-17938165be06.c7uewwm9qebj.eu-west-1.rds.amazonaws.com:5432/DATABASE_NAME",
     "username": "USERNAME"
    },
    "instance_name": "SERVICE_NAME",
    "label": "postgres",
    "name": "SERVICE_NAME",
    "plan": "PLAN",
    "provider": null,
    "syslog_drain_url": null,
    "tags": [
     "postgres",
     "relational"
    ],
    "volume_mounts": []
   }
  ]
 }
}
```

Refer to the [Cloud Foundry documentation on environment variables documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html) for more information.
