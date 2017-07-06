# Deploy a backing or routing service

## Services and plans

Many 12-factor applications rely on backing services such as a database, an email delivery service or a monitoring system. Routing services can be used to proxy and perform preprocessing on application requests such as caching, rate limiting or authentication.

In Cloud Foundry, backing and routing services are referred to as 'services' and are available through the Cloud Foundry ``cf marketplace`` command.

Currently, the only services available in the marketplace are the backing [PostgreSQL database service](/#using-postgresql) and [MySQL database service](/#using-mysql).

Each service in the marketplace can have multiple plans available. For example, there are different PostgreSQL plans which vary by availability, storage capacity and encryption.

Users can also define their own external services that are not available in the marketplace by using [User-Provided Service Instances](/#user-provided-service-instance).

### Paid service plans

Some service plans are paid: that is, you can potentially be billed by us for using them.

By default, access to paid plans is not enabled for a new organisation. Whether this is enabled or not is controlled by your [organisation's quota settings](/#quotas).

If you try to use a paid service and receive an error stating "service instance cannot be created because paid service plans are not allowed", please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### Accessing services

Your app can find out what backing services are available, and obtain credentials for the services, by parsing the VCAP_SERVICES [environment variable](/#environment-variables).

### User-Provided Service Instance

Cloud Foundry enables tenants to define [User-Provided Service Instance](https://docs.cloudfoundry.org/devguide/services/user-provided.html) [external link]. They can be used to deliver service credentials to an application, and/or to trigger streaming of application logs to a syslog compatible consumer. Once created, user-provided service instances behave like service instances created through the marketplace.

### Future services

We are going to add more services in future based on demand, including Elasticsearch and Redis. If you need a particular backing service that we don't yet support, please let us know at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).
