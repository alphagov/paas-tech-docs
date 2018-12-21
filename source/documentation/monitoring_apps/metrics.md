# Monitoring apps

## Metrics

Cloud Foundry provides time series data, or metrics, for each instance of your PaaS app. You can receive, store and view this data in a monitoring system of your choice by deploying one of the following apps:

- the [`paas-prometheus-exporter`](https://github.com/alphagov/paas-prometheus-exporter)
- the [`paas-metric-exporter`](https://github.com/alphagov/paas-metric-exporter) to push metrics data in the [StatsD](https://github.com/etsy/statsd/wiki) [external link] format

You can also view all metrics in a one-off snapshot by installing the Cloud Foundry CLI [log cache plug-in](https://github.com/cloudfoundry/log-cache-cli#installing-plugin) [external link].

### PaaS Prometheus exporter app

To use the PaaS Prometheus exporter app, you deploy it as an app on PaaS. The current metrics supported by this app are:

- CPU
- RAM
- disk usage data
- memory usage data
- app crashes
- app requests
- app response times

Before you set up the PaaS Prometheus exporter app, you will need:

- a monitoring system to store the metrics with an accompanying metrics endpoint
- a live Cloud Foundry account assigned to the spaces you want to receive metrics on

We recommend that this Cloud Foundry account:

- uses the [`SpaceAuditor` role](/orgs_spaces_users.html#space-auditor) as this role has the minimum permissions needed to meet the requirements of the metrics exporter app
- is separate to your primary Cloud Foundry account

To set up the PaaS Prometheus exporter app:

1. Clone the [PaaS Prometheus exporter repository](https://github.com/alphagov/paas-prometheus-exporter).
1. [Push the PaaS Prometheus exporter app](/deploying_apps.html#deploying-public-apps) to Cloud Foundry without starting the app by running `cf push --no-start prometheus-exporter`.
1. Set the following mandatory environment variables in the metrics exporter app by running `cf set-env prometheus-exporter NAME VALUE`:

	|Name|Value|
	|:---|:---|
	|`API_ENDPOINT`|- `https://api.cloud.service.gov.uk` for Ireland<br>- `https://api.london.cloud.service.gov.uk` for London|
	|`USERNAME`|Cloud Foundry User|
	|`PASSWORD`|Cloud Foundry Password|

	You should use the `cf set-env` command for these mandatory variables as they contain secret information, and this method will keep them secure.

	You can also set environment variables by amending the manifest file. We recommend that you use this method for optional environment variables that do not contain secret information. Refer to the [PaaS Prometheus exporter repository](https://github.com/alphagov/paas-prometheus-exporter) for more information.

1. Start the metrics exporter app by running `cf start prometheus-exporter`.

You can now check your monitoring system to see if you are receiving metrics.

If you are not receiving any metrics, check the [logs](/monitoring_apps.html#logs) for the metrics exporter app. If you still need help, please contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### Metrics exporter app with StatsD

To use the metrics exporter, you deploy it as an app on PaaS. The current metrics supported by this app are:

- CPU
- RAM
- disk usage data
- app crashes
- app requests
- app response times

Before you set up the metrics exporter app, you will need:

- a monitoring system to store the metrics with an accompanying [StatsD](https://github.com/etsy/statsd/wiki) [external link] endpoint set up
- a live Cloud Foundry account assigned to the spaces you want to receive metrics on

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
