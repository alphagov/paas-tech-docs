# Redis

Redis is an open source in-memory data store that can be used as a database cache or message broker.

### Set up a Redis service

To set up a Redis service:

1. Run the following in the command line to see what plans are available for Redis:

    ```
    cf marketplace -s redis
    ```

    There are currently two plans available for Redis:

    ```
    service plan           description                                                                free or paid
    tiny-clustered-3.2     568MB RAM, clustered (1 shard), single node, no failover, daily backups    paid
    tiny-unclustered-3.2   568MB RAM, non-clustered, single node, no failover, no backups             paid
    ```

    You should use the `tiny-clustered-3.2` plan as it is backed up every day. Refer to the [Redis plans](/deploying_services/redis/#redis-plans) section of the documentation for more information.

1. Run the following to create a service instance:

    ```
    cf create-service redis PLAN SERVICE_NAME
    ```

    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service redis tiny-clustered-3.2 my-redis-service
    ```

1. It will take between 5 and 10 minutes to set up the service instance. To check its progress, run:

    ```
    cf service SERVICE_NAME
    ```

    for example:

    ```
    cf service my-redis-service
    ```

    When `cf service SERVICE_NAME` returns a `create succeeded` status, you have set up the service instance. Example output:

    ```
    name:            my-redis-service
    service:         redis
    bound apps:
    tags:
    plan:            tiny-clustered-3.2
    description:     AWS ElastiCache Redis service
    documentation:
    dashboard:

    Showing status of last operation from service my-redis-service...

    status:    create succeeded
    message:   ---
               status               : available
               cluster id           : cf-u7zpvbwzxmrvu
               engine version       : 3.2.6
               maxmemory policy     : volatile-lru
               maintenance window   : sun:23:00-mon:01:30
               daily backup window  : 02:00-05:00
    started:   2018-02-21T10:44:16Z
    updated:   2018-02-21T10:52:31Z

    ```

### Bind a Redis service to your app

You must bind your app to the Redis service so you can access the cache from the app.

1. Use the [app's manifest](/deploying_apps.html#deployment-overview) to bind the app to the service instance. It will bind automatically when you next deploy your app. An example manifest:

    ```
    --
    applications:
      - name: my-app
        services:
        - my-redis-service
    ```
1. Deploy your app in line with your normal deployment process.

This binds your app to a service instance called `my-redis-service`.

Refer to the Cloud Foundry documentation on [deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) [external link] for more information.

#### Use the cf bind-service command

Alternatively, you can manually bind your service instance to your app.

1. Run the following:

    ```
    cf bind-service APP_NAME SERVICE_NAME
    ```

    where `APP_NAME` is the exact name of a deployed instance of your application and `SERVICE_NAME` is the name of the service instance you created. For example:

    ```
    cf bind-service my-app my-redis-service
    ```

1. Deploy your app in line with your normal deployment process.

### Connect to a Redis service from your app

Your app must make a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) [external link] connection to the service. Some libraries use TLS by default, but others will need to be manually configured.

Your app should parse the ``VCAP_SERVICES`` [environment variable](/deploying_apps.html#system-provided-environment-variables) to make a secure connection to Redis.

If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with `cf logs APP_NAME --recent`. See the section on [Logs](/monitoring_apps.html#logs) for details.

### Connect to a Redis service instance from your local machine

We have created the [Conduit](/guidance.html#conduit) plugin to simplify the process of connecting your local machine to a Redis service.

#### Prerequisites

You must:

- install the Redis CLI tool on your local machine (this is included in the [standard Redis installation](https://redis.io/download) [external link])
- [log into Cloud Foundry](/get_started.html#set-up-command-line)
- [target the space](/deploying_apps.html#set-a-target) where your Redis service instance is located

#### Install and configure Conduit

1. Run the following command to install the Conduit plugin:

    ```
    cf install-plugin conduit
    ```

1. Run the following command to connect to your service instance with the Redis client:

    ```
    $ cf conduit SERVICE_NAME -- redis-cli
    ```

    where `SERVICE_NAME` is a unique descriptive name for this service instance.

You have now connected your local machine to your Redis service instance using Conduit. You can test this connection with the Redis [PING command](https://redis.io/commands/ping) [external link]:

```
127.0.0.1:7081> PING
PONG
```

Run `cf conduit --help` for more options, and refer to the [Conduit readme file](https://github.com/alphagov/paas-cf-conduit/blob/master/README.md) [external link] for more information on how to use the plugin.

### Unbind a Redis service from your app

You must unbind the Redis service before you can delete your service instance. To unbind the Redis service, run the following code in the command line:

```
cf unbind-service APPLICATION SERVICE_NAME
```

where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your app's `manifest.yml` file or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

```
cf unbind-service my-app my-redis-service
```

If you unbind your services from your app but do not delete them, these services will persist even after your app is deleted. You can re-bind or reconnect to them in future.

### Delete a Redis service

Once the Redis service has been unbound from your app, you can delete your service instance. Run the following in the command line:

```
cf delete-service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.

Type `yes` when asked for confirmation.

### Data classification

You can store data classified up to ‘official’ on the GOV.UK PaaS. Refer to the [data security classification documentation](/deploying_services/#data-security-classification) for more information.

### Redis plans

There are two plans available for the Redis service:

- `tiny-clustered-3.2`
- `tiny-unclustered-3.2`

You cannot migrate a service from an unclustered to a clustered plan or vice versa.

Both plans include encryption at rest of the database storage. This means that both the data on the disk and in snapshots is encrypted.

#### tiny-clustered-3.2

We recommend that you use this plan as it is backed up every day. Note that:

- [Sidekiq](https://sidekiq.org) [external link] does not work with clustered Redis
- this plan cannot be [vertically scaled](/managing_apps.html#scaling) or upgraded to a bigger plan

#### tiny-unclustered-3.2

Use this plan if your client library cannot connect to clustered plans. Note that:

- it is not automatically backed up
- it can be [vertically scaled](/managing_apps.html#scaling) or upgraded to a bigger plan

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you need an unclustered plan with backups enabled, or a larger unclustered plan.

Refer to the [Redis documentation](https://redis.io/topics/cluster-tutorial) [external link] for more information on clusters.

### Redis maintenance & backups

#### Redis maintenance times

Every Redis service has a maintenance window of Sunday 11pm to Monday 1:30am UTC every week. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you require a different maintenance window.

For more information on maintenance times, refer to the [Amazon ElastiCache maintenance window documentation](https://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/VersionManagement.MaintenanceWindow.html) [external link].

#### Redis service backup

The data stored within any Redis service instance you create is backed up using the Amazon ElastiCache backup system. Backups are taken every day between 2am and 5am UTC. Data is retained for 7 days, and stored in [Amazon S3](https://aws.amazon.com/s3/) [external link].

To restore from the latest backup of your Redis service instance, create a new service instance by running the following code:

```
cf create-service redis PLAN NEW_SERVICE_NAME -c '{ "restore_from_latest_snapshot_of": "GUID" }'
```

where `PLAN` is the name of the plan, `NEW_SERVICE_NAME` is the name of your new service instance, and `GUID` is the UUID of the pre-existing backed-up instance. Get the `GUID` by running `cf service --guid SERVICE_NAME`.

To restore from an older backup, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

For more details about how the backup system works, see the [Amazon's ElastiCache backups documentation](https://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/backups-automatic.html) [external link].

### Redis key eviction policy

The eviction policy is the behaviour Redis follows when you reach your plan's maximum memory limit. The eviction policy can take the following values:

<div style="height:1px;font-size:1px;">&nbsp;</div>

|Eviction policy|Definition|
|:---|:---|
|`volatile-lru`| evict keys by trying to remove the least recently used (LRU) keys first, but only among keys that have an expire set, in order to make space for the new data added|
|`allkeys-lru`| evict keys by trying to remove the least recently used (LRU) keys first, in order to make space for the new data added|
|`allkeys-random`| evict keys randomly in order to make space for the new data added|
|`volatile-random`| evict keys randomly in order to make space for the new data added, but only evict keys with an expire set|
|`volatile-ttl`| evict keys with an expire set, and try to evict keys with a shorter time to live (TTL) first, in order to make space for the new data added|
|`noeviction`| return errors when the memory limit was reached and the client is trying to execute commands that could result in more memory to be used|

<div style="height:1px;font-size:1px;">&nbsp;</div>

Your Redis instance is set to use the `volatile-lru` eviction policy by default. You can check this by running the `cf service SERVICE_NAME` command.

You can set the eviction policy for an existing service instance by running:

```
cf update-service SERVICE_NAME -c '{"maxmemory_policy": "EVICTION_POLICY"}'
```

where `SERVICE_NAME` is a unique descriptive name for this service instance and `EVICTION_POLICY` is the eviction policy you want, for example:

```
cf update-service my-redis-service -c '{"maxmemory_policy": "volatile-ttl"}'
```

Refer to the [Redis LRU cache documentation](https://redis.io/topics/lru-cache) [external link] for more information.

### Further information

Refer to the [Amazon ElastiCache for Redis page](https://aws.amazon.com/elasticache/redis/) [external link] for more information.
