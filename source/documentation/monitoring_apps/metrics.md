## Metrics

Cloud Foundry provides time-series data, or metrics, for each instance of your PaaS app. You should use the metrics exporter app to send this data to a monitoring system of your choice. Your monitoring system can then store this data over time and let you view it.

>You can also view data as a one-off snapshot using the Cloud Foundry CLI.

To use the metrics exporter, you deploy it as an app on PaaS. The current metrics supported by the metrics exporter app are CPU, RAM and disk usage data.

### Setting up the metrics exporter app

Before you set up the metrics exporter app, you will need:

- a monitoring system to store the metrics with an accompanying [StatsD](https://github.com/etsy/statsd/wiki) [external link] endpoint set up
- a live Cloud Foundry account assigned to the spaces you want to receive metrics on; this account should be separate to your primary Cloud Foundry account

We recommend that the separate Cloud Foundry account uses the [`SpaceAuditor` role](/#organisations-spaces-amp-targets), as this role has the minimum permissions needed to meet the requirements of the metrics exporter app.

To set up the metrics app:

1. Clone the [https://github.com/alphagov/paas-metric-exporter](https://github.com/alphagov/paas-metric-exporter) repository.
2. [Push the metrics exporter app](/#deployment-overview) to Cloud Foundry without starting the app by running `cf push --no-start metric-exporter`.
3. Set the following mandatory environment variables in the metrics exporter app using `cf set-env metric-exporter NAME VALUE`:

	|Name|Value|
	|:---|:---|
	|`API_ENDPOINT`|Use `https://api.cloud.service.gov.uk`|
	|`STATSD_ENDPOINT`|StatsD endpoint|
	|`USERNAME`|Cloud Foundry User|
	|`PASSWORD`|Cloud Foundry Password|

	You should use the `cf set-env` command for these mandatory variables as they contain secret information, and this method will keep them secure.

	You can also set environment variables by amending the manifest file. We recommend that you use this method for optional environment variables that do not contain secret information. Refer to the [https://github.com/alphagov/paas-metric-exporter](https://github.com/alphagov/paas-metric-exporter) repository for more information.

4. Start your app by running `cf start metric-exporter`.

You can now check your monitoring system to see if you are receiving metrics.

### Troubleshooting

If you are not receiving the metrics, check the [logs](/#logs) for the metrics exporter app. If you still need help, please contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### More about monitoring

For more information about monitoring apps, see [Monitoring the status of your service](https://www.gov.uk/service-manual/technology/monitoring-the-status-of-your-service) on the Service Manual.
