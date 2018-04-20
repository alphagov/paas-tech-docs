## App restarts

Your app can restart outside of your control due to:

- Cloud Foundry taking action, such as upgrading the platform or applying operating system patches to virtual machines
- an unexpected issue, such as your app instance running out of memory or disk space

During a Cloud Foundry-driven restart, your app processes may be affected if they take longer than ten seconds to finish. Cloud Foundry will send a termination signal (`SIGTERM`) to any apps it wants to restart. To shut down cleanly, apps must finish any requests within ten seconds of receiving the termination signal. 

If the app does not respond in time, Cloud Foundry will send a `SIGKILL` signal to force-terminate the app. The app will not shut down cleanly and requests may fail. 

If your app has more than one instance, the running instances will not all restart at the same time. This ensures there are always available instances for your app.

For more information, refer to the Cloud Foundry documentation on:

- [high availability](https://docs.cloudfoundry.org/concepts/high-availability.html) [external link]
- [evacuations](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#evacuation) [external link]
- [shutdowns](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#shutdown) [external link]
