## Production checklist

Before you deploy an app to a production environment, you must:

- [get a domain from GOV.UK](https://www.gov.uk/service-manual/technology/get-a-domain-name) for your service and set the [DNS records required by your cdn-route service](https://docs.cloud.service.gov.uk/deploying_services/use_a_custom_domain/#set-up-a-cdn-route-service-with-one-or-more-custom-domains) on the GOV.UK PaaS
- build your app in line with the [12-factor app principles](https://docs.cloud.service.gov.uk/architecture.html#12-factor-application-principles)
- use a separate staging environment to test your app (refer to the [case studies on managing orgs, users and spaces](https://docs.cloud.service.gov.uk/orgs_spaces_users.html#case-studies) for more information)
- [configure an `http` health check](https://docs.cloudfoundry.org/devguide/deploy-apps/healthchecks.html) to allow Cloud Foundry to detect and attempt to replace unhealthy app instances

When you deploy an app to a production environment, you should:

- use version 3 of the Cloud Foundry API to [zero-downtime deploy your app](https://docs.cloud.service.gov.uk/get_started.html#use-cloud-foundry-api-version-3)
- use the [blue/green deployer plugin for Cloud Foundry](https://github.com/bluemixgaragelondon/cf-blue-green-deploy) to minimise app downtime if you are using version 2 of the Cloud Foundry API
- [run more than one instance of your app](/managing_apps.html#scaling) to make sure your app is always available
- select a high-availability plan for your app's [backing service](/deploying_services/#deploy-a-backing-or-routing-service) if your app uses a backing service
