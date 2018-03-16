## Failover process

### MongoDB

MongoDB uses replica sets i.e. clusters of MongoDB servers that replicate the contents of the master database. Replica sets provide high availability through sharding, a method for distributing data across multiple machines. A shard is a single mongod instance or replica set that stores some portion of a sharded cluster’s total data set. In the standard configuration for MongoDB on our service provider, you get a single-shard with three nodes in a replica-set. Mongo will push all write operations on to the primary data node and then propagate them to the secondary data node on the shard. Should the primary node fail, the secondary will be promoted to primary providing fault-tolerance and redundancy for your databases. The Mongo routers are responsible for dictating any failover, along with load-balancing operations to any of the nodes in the cluster.

>Your Mongo instances are backed up automatically, but are not yet directly available to tenants. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you need to recover a backup or want to know when related features will be in our roadmap.

### Elasticsearch

Visit the [Elasticsearch on Compose documentation](https://help.compose.com/docs/elasticsearch-on-compose#section-high-availability-and-failover-details) [external link] to see information about the availability and failover details for the Elasticsearch service.

## TLS connection to MongoDB and Elasticsearch

MongoDB and Elasticsearch use self-signed certificates. In order for your app to verify a TLS connection to these services, the app must use a CA certificate included in a VCAP_SERVICES environment variable.
