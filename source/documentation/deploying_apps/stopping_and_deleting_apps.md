## Stopping and deleting apps

It’s important to know that when you perform a ``cf push`` command, there are three things that happen on the platform:

1. your code is uploaded, after which a buildpack converts it to a single container, called a 'droplet', that can be run on PaaS as an app
2. the droplet is used to start the requested number of instances of that app
3. a route is created, connecting your app to the internet

When deleting apps you need to remember aspects 1 and 3.

Databases, CDNs and other services have a different lifecycle and need to be removed separately.

### Stopping and starting apps
If you temporarily want to stop your app, freeing up memory from your quota, you can use the command

``cf stop [appname]``

This will stop the app running (although databases and other provisioned services will still be running and chargeable). Users visiting your app's URL will get the error ``404 Not Found: Requested route ('[appname].cloudapps.digital') does not exist.``

You can start a stopped app with

``cf start [appname]``

### Deleting apps

**BEFORE YOU START: This is irreversible. We strongly recommend running the ``cf target`` command before you start: check you *are* where you think you are, and working on what you think you are working on.**

If you want to remove your app completely it’s tempting to jump in with the ``cf delete`` command, but there are a few things to beware of:

* Services that are used by apps do not automatically get deleted, and would still be chargeable
* Routes between the internet and your apps need to be explicitly removed.

If you have a simple app without any services the best way to delete it is

``cf delete -r [APPNAME]``

which will delete the app and its routes in one go. If your app does have services, please [delete them first](/deploying_apps.html#delete-a-service-instance).

If you accidentally delete your app without the ``-r`` option, you can delete the route manually. First confirm the details of the orphaned route by typing the ``cf routes`` command, to get a list of all active routes in the current space. This will list the space, the hostname, the overall domain (normally ``cloudapps.digital``), port, path, type and any bound apps or services. You will see your hostname listed but without an associated app. Use this information to populate the following command:

``cf delete-route [domain name] --hostname [hostname]``

### Delete a service instance

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
    cf unbind-service APPLICATION SERVICE_NAME
    ```
    where APPLICATION is the name of a deployed instance of your app (exactly as specified in your manifest or push command) and SERVICE_NAME is a unique descriptive name for this service instance, for example:

    ```
    cf unbind-service my-app mystuff
    ```

1. Run ``cf delete-service SERVICE_NAME`` to delete that service instance.
