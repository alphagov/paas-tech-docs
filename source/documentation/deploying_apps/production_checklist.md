## Production checklist

Before deploying an app for production use, check the following:

1. If your app uses a [backing service](/#deploy-a-backing-or-routing-service), make sure that you have selected the high-availability plan for the service instance.
1. You have [a domain name](https://www.gov.uk/service-manual/technology/get-a-domain-name) for your service.
1. You are running more than one instance of the app to ensure availability. Use ``cf scale APPNAME -i INSTANCES`` or amend the manifest file to add more running instances; see [Scaling](/#scaling) for more information.
1. You are prepared to use a [blue-green deployment process](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html) [external link] for when the app needs to be updated or restarted (this avoids problems due to a known issue with the PaaS that can generate transient 404 errors).
1. You have configured a [health check](https://docs.cloudfoundry.org/devguide/deploy-apps/healthchecks.html) [external link] by setting `health-check-type` to `http` and setting `health-check-http-endpoint` to an appropriate endpoint for your app.
