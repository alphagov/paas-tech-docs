## App restarts

Cloud Foundry will restart your app due to circumstances outside of your direct control, such as:

- platform upgrades
- failure of the underlying hardware platform
- applying operating system patches to virtual machines that host app instances

Cloud Foundry sends a termination signal (SIGTERM) to any apps it wants to restart. To shut down cleanly, apps must finish any requests within 10 seconds of receiving the termination signal. If the app does not respond in time, Cloud Foundry will force-terminate the app through a SIGKILL signal without shutting the app down cleanly, and requests may fail. 

If your app has more than one instance, the running instances will not all restart at the same time. This ensures there is always at least one available instance for your app.

For more information, see the Cloud Foundry documentation on [evacuation](https://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#evacuation).
