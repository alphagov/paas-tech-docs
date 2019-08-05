## Scaling

You can manually scale your app to meet increasing demand. You can do this by:

- changing the number of app instances running
- increasing memory and disk space allocated to your app

Your organisation [quotas](/managing_apps.html#quotas) limit the resources you can use for each app.

### Changing the number of app instances

You can change the number of instances of your app running at the same time. Running more than one app instance:

- allows your app to handle increased traffic and demand as incoming requests are automatically load-balanced across all instances
- helps maintain high availability and makes it less likely that the failure of a single component will take down your app

For example, run the following command to set the number of app instances to 5:

``cf scale APPNAME -i 5``

You can also use the manifest to set the number of instances that will start when you [push the app](deploying_apps.html#deploying-public-apps):

```
---
applications:
- name: APP_NAME
   instances: 2
```

For a [production](/deploying_apps.html#production-checklist) app, you should always run more than one instance.

### Increasing memory or disk space

You can scale an app vertically by increasing the memory or disk space available to each instance of the app.

For example, this command increases the available memory for an app to 1 gigabyte:

``cf scale APPNAME -m 1G``

This command increases the disk space limit for an app to 512 megabytes:

``cf scale myApp -k 512M``


### Further information

For more information, refer to the [Cloud Foundry documentation on using `cf scale` to scale an app](http://docs.cloudfoundry.org/devguide/deploy-apps/cf-scale.html) in the Cloud Foundry docs.
