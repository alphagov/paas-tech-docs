# Monitoring apps

## Metrics

Cloud Foundry provides time series data, or metrics, for each instance of your PaaS app. You can receive, store and view this data in a monitoring system of your choice by either:

- using the [Prometheus](https://prometheus.io/) [external link] endpoint provided by the GOV.UK PaaS team
- deploying the `paas-metric-exporter` app to push metrics data in [StatsD](https://github.com/etsy/statsd/wiki) [external link] format

You can also view all metrics in a one-off snapshot by installing the Cloud Foundry CLI [log cache plug-in](https://github.com/cloudfoundry/log-cache-cli#installing-plugin) [external link].

### Use the Prometheus endpoint

Prometheus uses the following API endpoints to request metrics from Cloud Foundry:

- `https://metrics.cloud.service.gov.uk/metrics` for the Ireland region
- `https://metrics.london.cloud.service.gov.uk/metrics` for the London region

PaaS maintains these endpoints for free, so you can access all available metrics for free. You can configure Prometheus manually to filter out any metrics you do not need.

You must set up Prometheus to request metrics from your region's API endpoint.

1. [Install Prometheus](https://prometheus.io/docs/prometheus/latest/getting_started/) [external link].

1. You must set up a bearer token so the API endpoint can authenticate your Prometheus request. We recommend you use a `bearer_token_file`. Set up an automated cron job to run the following command every 5 minutes:

	```
	cf oauth-token > /path/to/bearer_token_file.txt
	```

	where:
	- `cf oauth-token` is the command that generates a bearer token
	- `/path/to/bearer_token_file.txt` is the location and name of the `bearer_token_file` used by the Prometheus configuration

1. Configure Prometheus to read the bearer token from the `bearer_token_file.txt`. Refer to the Prometheus [configuration documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#ingress) [external link] for more information.

#### Use Docker to run Prometheus locally

You can set up Prometheus to request metrics from your region's API endpoint by using [Docker](https://www.docker.com/) [external link] to run a local instance of Prometheus.

1. Save the following script as `test-metrics.sh`:

	```
	#!/usr/bin/env bash
	set -ue

	echo "
	global:
	  scrape_interval: 1m
	  evaluation_interval: 1m
	  scrape_timeout: 1m

	scrape_configs:
	  - job_name: PaaS
	    bearer_token: $(cf oauth-token | sed 's/bearer //')
	    scheme: https
	    static_configs:
	      - targets:
	        - API_ENDPOINT:443
	" > prometheus.yml

	docker run --publish 9090:9090 \
	           --volume "$PWD/prometheus.yml:/etc/prometheus/prometheus.yml" \
	           prom/prometheus
	```
	where API_ENDPOINT is:
	- `https://metrics.cloud.service.gov.uk/metrics` for the Ireland region
	- `https://metrics.london.cloud.service.gov.uk/metrics` for the London region

1. Make the script executable:

	```
	chmod +x test-metrics.sh
	```

1. Execute the script:

	```
	./test-metrics.sh
	```

	If the script executes successfully, you will see the message:

	```
	msg="Server is ready to receive web requests."
	```

1. Open your web browser and go to `http://localhost:9090/targets`. You should see the local Prometheus instance running in a Docker container and receiving metrics.

If your local Prometheus instance is not receiving any metrics, check that the __PaaS State__ is __UP__.

If the __PaaS State__ is __UP__ and you are still not receiving any metrics, contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

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
