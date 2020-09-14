## Backing service metrics

If you use the [PostgreSQL](deploying_services/postgresql/#postgresql), [MySQL](deploying_services/mysql/#mysql) or [Redis](deploying_services/redis/#redis) backing services, you can view metrics for those backing services in the GOV.UK PaaS admin tool.

When you create your backing service instance, you can access the service instance’s metrics with no extra work. Your backing service plan does not affect which metrics you can view. You can view metrics for any date range within the last year.

Backing services instances exist in a [space](orgs_spaces_users.html#spaces) within an [org](orgs_spaces_users.html#organisations). You must be able to view a space in the GOV.UK PaaS admin tool to view metrics for backing service instances in that space.

### View backing service metrics

1. Sign into the GOV.UK PaaS admin tool for the [London region](https://admin.london.cloud.service.gov.uk/) or the [Ireland region](https://admin.cloud.service.gov.uk/).
1. Select the __Organisation__ and __Space__.
1. Select the __Backing services__ tab and select your backing service.
1. Select the __Metrics__ tab.

### Metrics definitions - PostgreSQL and MySQL

#### Free disk space

How much hard disk space your database has left. Your database will stop working if it runs out of disk space. Upgrade your service plan to get more disk space.

#### CPU utilisation

<<<<<<< HEAD
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
