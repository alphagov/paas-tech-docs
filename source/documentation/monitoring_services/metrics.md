## View backing service metrics

If you use the [PostgreSQL](deploying_services/postgresql/#postgresql), [MySQL](deploying_services/mysql/#mysql), [Redis](deploying_services/redis/#redis) or [Elasticsearch](deploying_services/elasticsearch/) backing services, you can view metrics for those backing services in the GOV.UK PaaS admin tool.

When you create your backing service instance, you can access the service instance’s metrics with no extra work. Your backing service plan does not affect which metrics you can view. You can view metrics for any date range within the last year.

Backing services instances exist in a [space](orgs_spaces_users.html#spaces) within an [org](orgs_spaces_users.html#organisations). You must be able to view a space in the GOV.UK PaaS admin tool to view metrics for backing service instances in that space.

1. Sign into the GOV.UK PaaS admin tool for the [London region](https://admin.london.cloud.service.gov.uk/) or the [Ireland region](https://admin.cloud.service.gov.uk/).
1. Select the __Organisation__ and __Space__.
1. Select the __Backing services__ tab and select your backing service.
1. Select the __Metrics__ tab.

## Exporting backing service metrics to Prometheus

If you are an advanced user you may want to export backing service metrics into your own system. To help you do this we can export your backing service metrics in Prometheus format.

Postgres and MySQL metrics are exported by the [PaaS Prometheus exporter](/monitoring_apps.html#use-the-paas-prometheus-exporter-app).

Elasticsearch and Redis metrics can be exported on request. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk)

In theory it is possible to run [Prometheus](https://prometheus.io) on the GOV.UK PaaS. By default Prometheus stores data on-disk, but our apps do not have persistent storage. Instead Prometheus can be configured to store data in our [InfluxDB backing service](/deploying_services/influxdb/). We have not tested this in production but would be eager to hear results.
