## App restarts

Your app can restart without you telling it to, due to:

- Cloud Foundry changes, such as platform upgrades or operating system patches 
- an unexpected issue, such as your app instance running out of memory or disk space

### Cloud Foundry changes

If your app processes take more than 10 seconds to finish, those processes will be affected by a Cloud Foundry-driven restart. Cloud Foundry will send a termination signal (`SIGTERM`) to any apps it wants to restart. To shut down cleanly, apps must finish any requests within 10 seconds of receiving the termination signal. 

If the app does not respond in time, Cloud Foundry will send a `SIGKILL` signal to terminate the app. The app will not shut down cleanly and requests may fail. 

If your app has more than one instance, the running instances will not restart at the same time. This makes sure that there are always available instances for your app.

For more information, refer to the Cloud Foundry documentation on how:

- to configure Cloud Foundry for [high availability](https://docs.cloudfoundry.org/concepts/high-availability.html) [external link]
- Cloud Foundry moves your app instances between servers [(evacuations)](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#evacuation) [external link]
- Cloud Foundry requests a shutdown of your app instance [(shutdowns)](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#shutdown) [external link]

