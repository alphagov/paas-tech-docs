# Monitoring apps

## Metrics

Cloud Foundry provides time series data, or metrics, for each instance of your PaaS app. You can receive, store and view this data in a monitoring system of your choice by deploying one of the following apps:

- the [`paas-prometheus-exporter`](https://github.com/alphagov/paas-prometheus-exporter) to collect, expose and consume metrics in the [Prometheus format](https://prometheus.io/docs/introduction/overview) [external link]
- the [`paas-metric-exporter`](https://github.com/alphagov/paas-metric-exporter) to push metrics data in the [StatsD format](https://github.com/etsy/statsd/wiki) [external link]

You can also view all metrics in a one-off snapshot by installing the Cloud Foundry CLI [log cache plug-in](https://github.com/cloudfoundry/log-cache-cli#installing-plugin) [external link].

### PaaS Prometheus exporter app

The PaaS Prometheus exporter collects metrics from your apps and any backing services configured to send metrics to the PaaS. 

To use the PaaS Prometheus exporter, you deploy it as an app on PaaS. Refer to the [PaaS Prometheus exporter readme documentation](https://github.com/alphagov/paas-prometheus-exporter/blob/master/README.md) [external link] for more information on supported metrics.

Before you set up the PaaS Prometheus exporter app, you will need:

- a Prometheus service to query or "scrape" a metrics endpoint, and store and expose all metrics from that endpoint
- a live Cloud Foundry account assigned to the orgs and spaces you want to receive metrics on

We recommend that this Cloud Foundry account:

- uses the [`SpaceAuditor` role](/orgs_spaces_users.html#space-auditor) as this role has the minimum permissions needed to meet the requirements of the PaaS Prometheus exporter app
- is separate to your primary Cloud Foundry account

To set up the PaaS Prometheus exporter app:

1. Clone the [PaaS Prometheus exporter repository](https://github.com/alphagov/paas-prometheus-exporter).

1. [Push the PaaS Prometheus exporter app](/deploying_apps.html#deploying-public-apps) to Cloud Foundry without starting the app:

	```
	cf push --no-start prometheus-exporter --hostname prometheus-exporter-ORGNAME
	```

	where `ORGNAME` is the name of your org. For example:
	
	```
	cf push --no-start prometheus-exporter --hostname prometheus-exporter-exampleorg
	```
	
	Running this example command deploys the PaaS Prometheus exporter app to `https://prometheus-exporter-exampleorg.cloudapps.digital` without starting the app.
	
	Refer to the documentation on [app names and domain hostnames](/deploying_apps.html#app-names-and-domain-hostname-clash) for more information on how to avoid duplicating existing app names.

1. Set the following mandatory environment variables in the PaaS Prometheus exporter app by running `cf set-env prometheus-exporter NAME VALUE`:

	|Name|Value|
	|:---|:---|
	|`API_ENDPOINT`|- `https://api.cloud.service.gov.uk` for Ireland<br>- `https://api.london.cloud.service.gov.uk` for London|
	|`USERNAME`|Cloud Foundry User|
	|`PASSWORD`|Cloud Foundry Password|

	You should use the `cf set-env` command for these mandatory variables as they contain secret information, and this method will keep them secure.

	You can also set environment variables by amending the manifest file. We recommend that you use this method for optional environment variables that do not contain secret information. Refer to the [PaaS Prometheus exporter repository](https://github.com/alphagov/paas-prometheus-exporter) for more information.

1. Configure your Prometheus service's metrics endpoint. The metrics endpoint is the deployed PaaS Prometheus exporter app URL with `/metrics` added on. For this example:

	```
	https://prometheus-exporter-exampleorg.cloudapps.digital/metrics
	```

1. Start the PaaS Prometheus exporter app by running `cf start prometheus-exporter`.

You can now check your Prometheus service to see if you are collecting metrics.

If you are not receiving any metrics, check the PaaS Prometheus exporter app [logs](/monitoring_apps.html#logs). 

If you still need help, please contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

#### Deploy the app with authentication

These instructions expose the PaaS Prometheus exporter app and metrics endpoint so that they are publicly accessible to everyone through the internet.

If you want to add authentication, refer to the documentation on [adding a route service to provide basic HTTP authentication](https://docs.cloud.service.gov.uk/deploying_services/route_services/#example-route-service-to-add-authentication).

### Metrics exporter app with StatsD

To use the metrics exporter, you deploy it as an app on PaaS. Refer to the [metrics exporter readme documentation](https://github.com/alphagov/paas-metric-exporter/blob/master/README.md) [external link] for more information on supposed metrics.

Before you set up the metrics exporter app, you will need:

- a monitoring system to store the metrics with an accompanying [StatsD](https://github.com/etsy/statsd/wiki) [external link] endpoint set up
- a live Cloud Foundry account assigned to the orgs and spaces you want to receive metrics on

We recommend that this Cloud Foundry account:

- uses the [`SpaceAuditor` role](/orgs_spaces_users.html#space-auditor) as this role has the minimum permissions needed to meet the requirements of the metrics exporter app
- is separate to your primary Cloud Foundry account

To set up the metrics exporter app:

1. Clone the [https://github.com/alphagov/paas-metric-exporter](https://github.com/alphagov/paas-metric-exporter) repository.
1. [Push the metrics exporter app](/deploying_apps.html#deploying-public-apps) to Cloud Foundry without starting the app by running `cf push --no-start metric-exporter`.
1. Set the following mandatory environment variables in the metrics exporter app by running `cf set-env metric-exporter NAME VALUE`:

	|Name|Value|
	|:---|:---|
	|`API_ENDPOINT`|- `https://api.cloud.service.gov.uk` for Ireland<br>- `https://api.london.cloud.service.gov.uk` for London|
	|`STATSD_ENDPOINT`|StatsD endpoint|
	|`USERNAME`|Cloud Foundry User|
	|`PASSWORD`|Cloud Foundry Password|

	You should use the `cf set-env` command for these mandatory variables as they contain secret information, and this method will keep them secure.

	You can also set environment variables by amending the manifest file. We recommend that you use this method for optional environment variables that do not contain secret information. Refer to the [https://github.com/alphagov/paas-metric-exporter](https://github.com/alphagov/paas-metric-exporter) repository for more information.

1. Start the metrics exporter app by running `cf start metric-exporter`.

You can now check your monitoring system to see if you are receiving metrics.

If you are not receiving any metrics, check the [logs](/monitoring_apps.html#logs) for the metrics exporter app. If you still need help, please contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### More about monitoring

For more information about monitoring apps, see [Monitoring the status of your service](https://www.gov.uk/service-manual/technology/monitoring-the-status-of-your-service) on the Service Manual.
