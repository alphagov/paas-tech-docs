## Stopping and starting apps

Run the following in the command line to temporarily stop your app and free up memory from your [quota](/managing_apps.html#quotas):

```
cf stop APP_NAME
```

Users visiting your app's URL will get the error:

```
404 Not Found: Requested route ('APP_NAME.APP_DOMAIN') does not exist.
```

Databases and other provisioned services will still be running, and GOV.UK PaaS will charge you for any paid plans or services.

Run the following to restart a stopped app:

```
cf start APP_NAME
```

## Deleting apps

<%= warning_text('Deleting an app is irreversible.') %>

You should run `cf target` to check which [org](/orgs_spaces_users.html#organisations) and [space](/orgs_spaces_users.html#spaces) you are in before you delete an app.

Run the following to delete an app:

```
cf delete -r APPNAME
```

### Deleting app routes

Run the following to delete an app and that app’s [routes](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#routes) at the same time:

```
cf delete -r APPNAME
```

You can delete an app’s routes separately.

1. Run `cf routes` to get a list of all active routes in the current space. This command will also list information about the routes, including hostname and [app domain](/orgs_spaces_users.html#regions).

1. Run the following to delete the app’s routes:

    ```
    cf delete-route DOMAIN_NAME --hostname HOSTNAME
    ```

### Deleting a service instance

You must unbind a service instance from any apps it is bound to before you can delete that service instance. Note:

- you do not need to delete an app's service instances before you can delete that app
- a service instance can be bound to more than one app

1. Run `cf services` to see all service instances in your targeted space. You will see the output as per this example:

    ```
    name      service    plan    bound apps    last operation
    mystuff   postgres   small   my-app        create succeeded
    mydb      mysql      large   not-my-app    create succeeded
    ```

1. Run the following to unbind a service instance:

    ```
    cf unbind-service APP_NAME SERVICE_NAME
    ```
    where:

    - `APP_NAME` is the name of a deployed instance of your app exactly as specified in your manifest or push command
    - `SERVICE_NAME` is a unique descriptive name for this service instance

1. Run ``cf delete-service SERVICE_NAME`` to delete that service instance.
