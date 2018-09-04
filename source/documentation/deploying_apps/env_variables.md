## Environment variables

All the configuration information for your app must be stored as environment variables, not in the code. 

This includes credentials for external services that your app uses, such as a Twitter account, as well as values that will vary with each deployment of the app, like the canonical URL.

To view an app's current environment variables, run:

``cf env APPNAME``

To create or update a variable, use:

``cf set-env APPNAME ENV_VAR_NAME ENV_VAR_VALUE``

If you're deploying a pre-existing app that was written with 12-factor in mind, check the app's documentation for any environment variables you need to set.

If the app has instructions to deploy to Heroku, and tells you to do something like:

``heroku config:set VARIABLE=value``

then you should do the equivalent command with ``cf set-env``:

``cf set-env APPNAME VARIABLE value``

### System-provided environment variables

As well as environment variables you set yourself, there are a number of system-provided variables which give you information about configuration details handled by the PaaS: the port on which the application is listening, the maximum memory each instance can use, the external IP address of the instance, and so on.

Do not attempt to change the values of these system-provided variables with the CLI or your app's code.

For a full list, see Cloud Foundry's [Cloud Foundry Environment Variables](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html) [external link] documentation.

Two important variables for initial setup are:

* `VCAP_SERVICES` contains details (including credentials) of any backing services bound to the app
* `VCAP_APPLICATION` provides details of the currently running application (for example, language runtime version)

To see the values of the system-provided variables, run `cf env APPNAME`.

If your app connects to a backing service, you may need to have it parse `VCAP_SERVICES` to get the credentials and other settings relating to that service and set the appropriate environment variables.

However, some buildpacks will do this for you automatically. See the deploy instructions for the language/framework you are using for details.

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
