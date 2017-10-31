## PostgreSQL connection problems

If you are having trouble connecting your app to a PostgreSQL database, follow the steps below. You can also apply these instructions to [other backing services](/#deploy-a-backing-or-routing-service). If you require more guidance for other supported backing services, contact us at gov-uk-paas-support@digital.cabinet-office.gov.uk.

1. Ensure your app is making a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the PostgreSQL service.
2. Use ``cf service SERVICE_INSTANCE`` to check that the service is bound to the app.
2. Use ``cf env APPNAME`` to see the app's environment variables and confirm that there is a ``VCAP_SERVICES={"postgres":`` section, indicating the app has correctly received the environment variables.
3. Make sure your app writes database connection errors to `STDOUT` or `STDERR`, then look for recent errors with ``cf logs APPNAME --recent``.
4. If restarting the app doesn't make it connect, try [restaging](https://docs.cloudfoundry.org/devguide/deploy-apps/start-restart-restage.html#restage) the app with ``cf restage APPNAME``.
