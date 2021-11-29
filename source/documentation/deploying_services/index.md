# Deploy a backing or routing service

Many 12-factor applications rely on backing services such as a database, an email delivery service or a monitoring system. Routing services can be used to proxy and perform preprocessing on application requests such as caching, rate limiting or authentication.

In Cloud Foundry, backing and routing services are referred to as ‘services’ and are available through the Cloud Foundry `cf marketplace` command. GOV.UK PaaS enables you to create a backing service and bind it to your app. The available backing services are:

- [PostgreSQL](postgresql/#postgresql)
- [MySQL](mysql/#mysql)
- [Redis](redis/#redis)
- [Elasticsearch](elasticsearch/#elasticsearch)
- [OpenSearch](opensearch/#opensearch)
- [Amazon S3](s3/#amazon-s3)
- [Amazon SQS](sqs/#amazon-sqs)
- [InfluxDB](influxdb/#influxdb)

## Sharing service instances

It’s normally only possible to bind applications to service instances in the same space. Sharing a service instance means applications in one space can bind to service instances in another space, either in the same organisation or in a different one.  Sharing a service instance between spaces allows applications in different spaces to share services such as databases.
See the [Cloud Foundry documentation on sharing service instances](https://docs.cloudfoundry.org/devguide/services/sharing-instances.html) for more information.

### Set up sharing service instances

You can now share instances of the following services between organisations and spaces:

* Amazon S3
* Amazon SQS
* Elasticsearch
* OpenSearch
* InfluxDB
* MySQL
* PostgreSQL
* Redis



Using the [Cloud Foundry Command Line Interface](https://docs.cloudfoundry.org/cf-cli/) (cf CLI), enter the `cf create-service` command to create a service:

```
cf create-service SERVICE PLAN SERVICE_INSTANCE
```

For example:

```
cf create-service postgres tiny-unencrypted-11 postgres-db
```


Share the service instance with another space:

```
cf share-service SERVICE_INSTANCE -s OTHER_SPACE [-o OTHER_ORG]
```

For example:

```
cf share-service postgres-db -s team-b
```

Check the previous command worked by entering:

```
cf service SERVICE_INSTANCE
```

For example:

```
cf service postgres-db
```

If you’ve correctly set up the sharing of the service instance, you should see the following text in the output:

```
shared with spaces:
org         space    bindings
demo-org   team-b   0
```



## Data security classification

You can store data classified up to ‘official’ on the GOV.UK PaaS.

You cannot store data classified ‘secret‘ or ‘top secret‘ on the GOV.UK PaaS.

Refer to the [information assurance page](https://www.cloud.service.gov.uk/information-assurance/) for more information on the assurance process.

Refer to the [GOV.UK page on government security classifications](https://www.gov.uk/government/publications/government-security-classifications) for more information on these classifications.
