## App restarts

Your app can restart without you telling it to, due to:

- Cloud Foundry changes, such as platform upgrades or operating system patches
- an unexpected issue, such as your app instance running out of memory or disk space

### Cloud Foundry changes

If your app processes take more than 10 seconds to finish, those processes will be affected by a Cloud Foundry-driven restart. Cloud Foundry will send a termination signal (`SIGTERM`) to any apps it wants to restart. To shut down cleanly, apps must finish any requests within 10 seconds of receiving the termination signal.

If the app does not respond in time, Cloud Foundry will send a `SIGKILL` signal to terminate the app. The app will not shut down cleanly and requests may fail.

If your app has more than one instance, the running instances will not restart at the same time. This makes sure that there are always available instances for your app.

For more information, refer to the Cloud Foundry documentation on how:

- to configure Cloud Foundry for [high availability](https://docs.cloudfoundry.org/concepts/high-availability.html#cf-ha)
- Cloud Foundry moves your app instances between servers using [evacuations](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#evacuation)
- Cloud Foundry requests a [shutdown of your app instance](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#shutdown)

### 404s after commands that restart your app

After you use a command that restarts application instances, such as ``cf push`` or ``cf restart``, your app may temporarily return incorrect 404 errors instead of returning a 5XX error. Apart from the brief downtime, this may lead to problems if the 404 is cached, or visiting web crawling bots (as used by search engines) receive a 404.

Commands known to do this are:

- ``cf push``
- ``cf restage``
- ``cf restart``
- ``cf scale`` when changing disk or memory limits or forcing a restart

We are working on a fix to prevent this happening.

Until this fix is live, you should use a [blue-green deployment process](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html). This is where you have two versions of an app, one that is 'live' and one that is undergoing an update or restart. There are plugins for the Cloud Foundry command line client to help this process. We recommend the [cf-blue-green-deploy](https://github.com/bluemixgaragelondon/cf-blue-green-deploy) plugin.
