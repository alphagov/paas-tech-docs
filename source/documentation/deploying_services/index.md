# Deploy a backing service

## Services and plans

Many 12-factor applications rely on backing services such as a database, an email delivery service or a monitoring system.

In Cloud Foundry, backing services are referred to as 'services' and are available through the Cloud Foundry ``cf marketplace`` command.

Currently, the only service available is the [PostgreSQL database service](/#postgresql). 

Each service can have multiple plans available. For example, there are different PostgreSQL plans which vary by availability, storage capacity and encryption.


### Paid service plans

Some service plans are paid: that is, you can potentially be billed by us for using them. 

By default, access to paid plans is not enabled for a new organisation. Whether this is enabled or not is controlled by your [organisation's quota settings](/#quotas).

If you try to use a paid service and receive an error stating "service instance cannot be created because paid service plans are not allowed", please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### Accessing services

Your app can find out what backing services are available, and obtain credentials for the services, by parsing the VCAP_SERVICES [environment variable](/#environment-variables).

### Future services

We are going to add more services in future based on demand, including Elasticsearch and Redis. If you need a particular backing service that we don't yet support, please let us know at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).