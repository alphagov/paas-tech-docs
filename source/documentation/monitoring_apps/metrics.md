## Exporting metrics data

Cloud Foundry provides data over time known as metrics for each instance of your app. We recommend you use the metrics exporter app to send this data to a monitoring system of your choice. Your monitoring system can then store this data over time and allow you to view it.

>You can also view your data as a one-off snapshot using the Cloud Foundry CLI.

To use the metrics exporter, you deploy it as an app on PaaS. The current metrics provided by the PaaS are CPU, RAM and disk usage data.

### Set up the app

You will need the following pre-requisites:

- a monitoring system to store the metrics data with an accompanying [StatsD](https://github.com/etsy/statsd/wiki) [external link] endpoint set up
- a live Cloud Foundry account separate to your normal account that is assigned to the spaces you want to receive metrics data on

We recommend that the separate Cloud Foundry account uses the [`SpaceAuditor`] role(/#organisations-spaces-amp-targets), as this role has the minimum permissions needed to fulfil the requirements of the metrics exporter app.

To set up the metrics app:

1. Clone the [https://github.com/alphagov/paas-cf-apps-statsd](https://github.com/alphagov/paas-cf-apps-statsd) repo.
1. [Push the metrics exporter app](/#deployment-overview) to Cloud Foundry without starting the app by using `cf push --no-start metric-exporter`.
1. Set the following mandatory environment variables in the metrics exporter app using `cf set-env metric-exporter NAME VALUE`:

|Name|Value|
|:---|:---|
|`API_ENDPOINT`|Use `https://api.cloud.service.gov.uk`|
|`STATSD_ENDPOINT`|StatsD endpoint|
|`USERNAME`|Cloud Foundry User|
|`PASSWORD`|Cloud Foundry Password|

4. Start your app by running `cf start metric-exporter`.

We recommend using the `cf set-env` command for the mandatory environment variables above as they contain secret information. There are other optional environment variables that can be set by amending the manifest file. Refer to the [https://github.com/alphagov/paas-cf-apps-statsd](https://github.com/alphagov/paas-cf-apps-statsd) repo for more information.

You can now check your monitoring system to see if you are receiving metrics data.

If you are not receiving the metrics data, check the [logs](/#logs) for the metrics exporter app. If you still need help, please contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).
