# Deploy a backing or routing service

Many 12-factor applications rely on backing services such as a database, an email delivery service or a monitoring system. Routing services can be used to proxy and perform preprocessing on application requests such as caching, rate limiting or authentication.

In Cloud Foundry, backing and routing services are referred to as ‘services’ and are available through the Cloud Foundry `cf marketplace` command. GOV.UK PaaS enables you to create a backing service and bind it to your app. The available backing services are:

- [PostgreSQL](postgresql/#postgresql)
- [MySQL](mysql/#mysql)
- [Redis](redis/#redis)
- [Elasticsearch](elasticsearch/#elasticsearch)
- [Amazon S3](s3/#amazon-s3)

## Data security classification

You can store data classified up to ‘official’ on the GOV.UK PaaS.

You cannot store data classified ‘secret‘ or ‘top secret‘ on the GOV.UK PaaS.

Refer to the [information assurance page](https://www.cloud.service.gov.uk/ia) for more information on the assurance process.

Refer to the [GOV.UK page on government security classifications](https://www.gov.uk/government/publications/government-security-classifications) for more information on these classifications.
