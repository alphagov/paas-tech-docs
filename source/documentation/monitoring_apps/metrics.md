# Monitoring apps

## App metrics

Cloud Foundry provides time series data known as metrics for each instance of your PaaS app. You can receive, store and view this data in a monitoring system of your choice by deploying either the:

- [`paas-prometheus-exporter`](https://github.com/alphagov/paas-prometheus-exporter) app to collect and display metrics in the [Prometheus format](https://prometheus.io/docs/introduction/overview)
- [`paas-metric-exporter`](https://github.com/alphagov/paas-metric-exporter) app to push metrics data in the [StatsD format](https://github.com/etsy/statsd/wiki)

You can also view all metrics in a one-off snapshot by installing the [Cloud Foundry CLI log cache plug-in](https://github.com/cloudfoundry/log-cache-cli#installing-plugin).

### Use the PaaS Prometheus exporter app

The PaaS Prometheus exporter collects metrics from your apps and any backing services configured to send metrics to the PaaS.

To use the PaaS Prometheus exporter, deploy it as an app on the GOV.UK PaaS. Refer to the [PaaS Prometheus exporter readme documentation](https://github.com/alphagov/paas-prometheus-exporter/blob/master/README.md) for more information on supported metrics.

#### Prerequisites

Before you set up the PaaS Prometheus exporter app, you’ll need a:

- Prometheus service to request or ‘scrape’, store and expose metrics from a metrics endpoint
- live [GOV.UK PaaS account](https://docs.cloud.service.gov.uk/get_started.html#get-an-account) assigned to the orgs and spaces you want to receive metrics on

We recommend this GOV.UK PaaS account:

- uses the [`SpaceAuditor` role](/orgs_spaces_users.html#space-auditor) as this role has the minimum permissions needed to meet the requirements of the PaaS Prometheus exporter app
- is separate to your primary GOV.UK PaaS account

#### Set up the app

1. Clone the [PaaS Prometheus exporter repository](https://github.com/alphagov/paas-prometheus-exporter).

1. [Push the PaaS Prometheus exporter app](/deploying_apps.html#deploying-public-apps) to Cloud Foundry without starting the app:

	```
	cf push --no-start prometheus-exporter --hostname prometheus-exporter-ORGNAME
	```

	where `ORGNAME` is the name of your org. For example:

	```
	cf push --no-start prometheus-exporter --hostname prometheus-exporter-exampleorg
	```

	Running this command deploys the PaaS Prometheus exporter app to `https://prometheus-exporter-exampleorg.cloudapps.digital` without starting the app.

	Refer to the [app names and domain hostnames documentation](/deploying_apps.html#app-names-and-domain-hostname-clash) for more information on how to avoid duplicating existing app names.

1. Set the following mandatory environment variables in the PaaS Prometheus exporter app by running `cf set-env prometheus-exporter NAME VALUE`:

	|Name|Value|
	|:---|:---|
	|`API_ENDPOINT`|- `https://api.cloud.service.gov.uk` for Ireland<br>- `https://api.london.cloud.service.gov.uk` for London|
	|`USERNAME`|Cloud Foundry User|
	|`PASSWORD`|Cloud Foundry Password|

	You should use the `cf set-env` command for these mandatory variables as they contain secret information, and this method will keep them secure.

	You can also set environment variables by changing the manifest file. You should do this for optional environment variables that do not contain secret information. Refer to the [PaaS Prometheus exporter repository](https://github.com/alphagov/paas-prometheus-exporter) for more information.

1. Start the PaaS Prometheus exporter app:

	```
	cf start prometheus-exporter
	```

1. Configure your Prometheus service's metrics endpoint. The metrics endpoint is the deployed PaaS Prometheus exporter app URL with `/metrics` added on to the end. For this example:

	```
	https://prometheus-exporter-exampleorg.cloudapps.digital/metrics
	```

You can now check your Prometheus service to see if you are collecting metrics.

If you do not receiving any metrics, check the PaaS Prometheus exporter app [logs](/monitoring_apps.html#logs).

If you still need help, contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

#### Add authentication

By default, the PaaS Prometheus exporter app and metrics endpoint are publicly accessible to everyone through the internet.

If you want to add authentication to the app and endpoint, refer to the documentation on [adding a route service to provide basic HTTP authentication](https://docs.cloud.service.gov.uk/deploying_services/route_services/#example-route-service-to-add-authentication).

### Metrics exporter app with StatsD

To use the metrics exporter, you deploy it as an app on PaaS. Refer to the [metrics exporter readme documentation](https://github.com/alphagov/paas-metric-exporter/blob/master/README.md) for more information on supported metrics.

Before you set up the metrics exporter app, you will need:

- a monitoring system to store the metrics with an accompanying [StatsD](https://github.com/etsy/statsd/wiki) endpoint set up
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

## Backing service metrics

If you use the [PostgreSQL](deploying_services/postgresql/#postgresql), [MySQL](deploying_services/mysql/#mysql) or [Redis](deploying_services/redis/#redis) backing services, you can view metrics for those backing services in the GOV.UK PaaS admin tool.

When you create your backing service instance, you can access the service instance’s metrics with no extra work. Your backing service plan does not affect which metrics you can view. You can view metrics for any date range within the last year.

Backing services instances exist in a [space](orgs_spaces_users.html#spaces) within an [org](orgs_spaces_users.html#organisations). You must be able to view a space in the GOV.UK PaaS admin tool to view metrics for backing service instances in that space.

### View backing service metrics

1. Sign into the GOV.UK PaaS admin tool for [London](https://admin.london.cloud.service.gov.uk/) or [Ireland](https://admin.cloud.service.gov.uk/).
1. Select the __Organisation__ and __Space__.
1. Select the __Backing services__ tab and select your backing service.
1. Select the __Metrics__ tab.

### Metrics definitions - PostgreSQL and MySQL

#### Free disk space

How much hard disk space your database has left. Your database will stop working if it runs out of disk space. Upgrade your service plan to get more disk space.

#### CPU utilisation

How much computational work your database is doing. If you think your CPU utilisation is too high, you can optimise your database queries or upgrade your service plan.

#### Open connections

How many open connections there are to your database. If the values are unexpectedly high, you may need to optimise how your app connects to the database, or upgrade your service plan. Unexpectedly low values may indicate the database is unavailable, or your apps cannot connect to the database.

#### Available memory

How much memory the virtual machine your database is running on has left. If values are persistently low, you may need to optimise your database queries, or upgrade your service plan.

#### Read and write operations per second

How many read and write operations per second (IOPS) your database is performing per second. Databases have a limit of 3 IOPS per gigabyte of database hard disk space. This limit applies to the sum of the read and write operations. 

For example, a 100 gigabyte database has a 300 IOPS limit. If your database is close to its IOPS limit, you can upgrade your service plan.

See the [documentation on Amazon RDS database instance storage](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html#CHAP_Storage.IO.Credits) for more information.

### Metrics definitions - Redis

#### CPU utilisation

How much computational work your Redis service instance is doing. If you think your CPU utilisation is too high, you can optimise how you read data from and write data to Redis, or upgrade your service plan.

#### Memory used

How much memory your Redis service instance is using to run itself and to store your app data. Redis service instances have a limited amount of memory to use. This memory limit is fixed based on your service plan and you cannot change this limit. 

Your Redis service instance will delete or [evict keys](https://redis.io/topics/lru-cache) when the instance reaches its memory limit. This may indicate you need to review the size of the data you're storing, or you need to upgrade your service plan.

#### Swap memory used

If your Redis service instance is running low on memory, the instance will start to swap memory onto the hard disk. To reduce memory swapping, you can reduce the amount of memory your Redis service instance uses, or upgrade your service plan.

#### Key evictions

Your Redis service instance will delete or [evict keys](https://redis.io/topics/lru-cache) when the instance reaches its memory limit. Memory limit is fixed based on your service plan and you cannot change this limit.

Redis instances on the GOV.UK PaaS use the [volatile-lru policy](https://redis.io/topics/lru-cache#eviction-policies). This means Redis instances can only evict keys that have a set expiry time. Your Redis service instance will try to evict less recently used keys first. If your service instance cannot evict any keys, the instance will return errors when executing commands that increase memory use. Upgrade your service plan to reduce key eviction.

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to find out your plan's memory limit.

#### Open connections

How many open connections there are to your Redis service instance. If the values are unexpectedly high, you may need to optimise how your app connects to your service instance, or upgrade your service plan. Unexpectedly low values may indicate that your service instance is unavailable.

#### Cache hits and misses

The number of successful and unsuccessful Redis key lookups. If the number of cache misses is higher than the number of cache hits, you may need to optimise how you implemented your app.

#### Item count

The number of items in Redis.

#### Network bytes in and out

The number of bytes Redis has received and sent.
