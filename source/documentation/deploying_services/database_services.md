## Failover process

### MongoDB

Refer to the [MongoDB documentation on High Availability](https://docs.mongodb.com/manual/core/replica-set-high-availability/) [external link] for information on the availability and failover processes for MongoDB. 

>Your Mongo instances are backed up automatically, but are not yet directly available to tenants. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you need to recover a backup or want to know when related features will be in our roadmap.

### Elasticsearch

Visit the [Elasticsearch on Compose documentation](https://help.compose.com/docs/elasticsearch-on-compose#section-high-availability-and-failover-details) [external link] to see information about the availability and failover details for the Elasticsearch service.

## Accessing the service from your app

MongoDB and Elasticsearch use self-signed certificates. In order for your app to verify a TLS connection to these services, the app must use a CA certificate included in a VCAP_SERVICES environment variable.
