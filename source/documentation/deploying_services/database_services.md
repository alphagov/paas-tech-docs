## Using backing services

To see the available plans, run:

```
cf marketplace -s SERVICE
```

SERVICE can currently take the following values:

 * postgres
 * mysql
 * mongodb
 * redis
 * elasticsearch

Here is a shortened example of the sort of output you will see for the PostgreSQL service (the exact plans will vary):

```
service plan             description                                                                                                                                                       free or paid
M-dedicated-X.X          20GB Storage, Dedicated Instance, Max 500 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.m4.large.                                           paid
M-HA-dedicated-X.X       20GB Storage, Dedicated Instance, Highly Available, Max 500 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.m4.large.                         paid
...
Free                     5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.t2.micro.                              free
```

### Failover process

#### High availability plans - PostgreSQL and MySQL

We recommend you use one of the high availability plans (indicated by `HA` in the name) for your PostgreSQL and MySQL apps. These plans use Amazon RDS Multi-AZ instances which are designed to be 99.95% available (see [Amazon's SLA](https://aws.amazon.com/rds/sla/) for details).

When you use the high availability plan, Amazon RDS provides a hot standby service for failover in the event that the original service fails.

The failover process means that Amazon RDS will automatically change the DNS record of the database instance to point to the standby instance. You should make sure that your app doesn't cache the database IP, and any DNS caching should be configured with a low time to live (TTL). Consult the documentation for the language/framework you are using to find out how to do this.

During failover, there will be an outage period (from tens of seconds to a few minutes).

See the [Amazon RDS documentation on the failover process](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) for more details.

You should test how your app deals with a failover to make sure you are benefiting from the high availability plan. We can trigger a failover for you. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to arrange this.

#### High availability plans - MongoDB

MongoDB uses replica sets i.e. clusters of MongoDB servers that replicate the contents of the master database. Replica sets provide high availability through sharding, a method for distributing data across multiple machines. A shard is a single mongod instance or replica set that stores some portion of a sharded cluster’s total data set. In the standard configuration for MongoDB on our service provider, you get a single-shard with three nodes in a replica-set. Mongo will push all write operations on to the primary data node and then propagate them to the secondary data node on the shard. Should the primary node fail, the secondary will be promoted to primary providing fault-tolerance and redundancy for your databases. The Mongo routers are responsible for dictating any failover, along with load-balancing operations to any of the nodes in the cluster.

>Your Mongo instances are backed up automatically, but are not yet directly available to tenants. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you need to recover a backup or want to know when related features will be in our roadmap.

#### High availability plans - Elasticsearch

Visit the [Elasticsearch on Compose documentation](https://help.compose.com/docs/elasticsearch-on-compose#section-high-availability-and-failover-details) [external link] to see information about the availability and failover details for the Elasticsearch service.

### Encrypted plans

Plans with ``enc`` in the name include encryption at rest of the database storage. This means that the data on the disk and in snapshots is encrypted.

We recommend that you use an encrypted plan for production services or those that use real data.

Once you've created a service instance, you can't enable or disable encryption. There's no way to convert an unencrypted service instance to an encrypted one later.

> This currently only applies to PostgreSQL and MySQL services.

### Read replicas

Amazon RDS has the capability to provide a read replica: a read-only copy of your database. This can be useful for performance, availability or security reasons.

See the [Amazon RDS documentation on read replicas](https://aws.amazon.com/rds/details/read-replicas/) to learn more.

GOV.UK PaaS doesn't currently support read replicas, but if you think you would find them useful, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), providing details of your use case.

> This applies to PostgreSQL and MySQL services.

### Setting up a service

To create a service and bind it to your app:

1. From the command line, run:

    ``cf marketplace -s SERVICE``

    where SERVICE is the service you want, to see details of the available plans.

3. Run:

    ``cf create-service SERVICE PLAN SERVICE_INSTANCE``

    where PLAN is the plan you want, and SERVICE_INSTANCE is a unique, descriptive name for this instance of the service; for example:

    ``cf create-service postgres M-dedicated-9.5 my-pg-service``

    Note that for production usage, we recommend you select a high-availability encrypted plan.

3. It may take some time (5 to 10 minutes) for the service instance to be set up. To find out its status, run:

    ``cf service SERVICE_INSTANCE``

    for example:

    ``cf service my-pg-service``

    where SERVICE_INSTANCE is the name you gave the instance when you created it.

4. Wait until the service status reported by the above command is 'create succeeded'. Here is an example of the type of output you will see once the service is created:


        Service instance: my-pg-service
        Service: postgres
        Bound apps:
        Tags:
        Plan: M-dedicated-9.5
        Description: AWS RDS PostgreSQL service
        Documentation url: https://aws.amazon.com/documentation/rds/
        Dashboard:

        Last Operation
        Status: create succeeded
        Message: DB Instance 'rdsbroker-9f053413-97a5-461f-aa41-fe6e29db323e' status is 'available'
        Started: 2016-08-23T15:34:41Z
        Updated: 2016-08-23T15:42:02Z



5. You can now bind the service to your app. Run:

    ``cf bind-service APPLICATION SERVICE_INSTANCE``

    where APPLICATION is the name of a deployed instance of your application (exactly as specified in your manifest or push command), for example:

    ``cf bind-service my-app my-pg-service``

5. If the app is already running, you should restage the app to make sure it connects:

    ``cf restage APPLICATION``

6. To confirm that the service is bound to the app, you can run:

    ``cf service SERVICE_INSTANCE``

    and check the ``Bound apps:`` line of the output.


### Changing service plans

It is possible to upgrade to a larger service plan using the `update-service` command. For example if you are currently on a "Free" postgres plan and wanted to upgrade to a larger high-availability plan you could run:

```
cf update-service my-pg-service -p S-HA-dedicated-9.5
```
> It is not currently supported to _downgrade_ service plans.

The process of changing plan will begin immediately and will usually be completed within about an hour. You can check the status of the change by viewing the output of `cf services`.

#### Maintenance windows (PostgreSQL and MySQL only)

Depending on the service, the process of migrating to a new plan may cause interruption to your service instance. If you would rather queue the change to begin during a maintenance window, run:

```
cf update-service my-pg-service -p S-HA-dedicated-9.5 -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "wed:03:32-wed:04:02"}'
```

> Passing the `preferred_maintenance_window` parameter will alter the default maintenance window for any future maintenance events required for the database instance.



### Accessing the service from your app

Your app must make a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the service. Some libraries use TLS by default, but others will need to be explicitly configured.

>MongoDB and Elasticsearch use self-signed certificates. In order for your app to verify a TLS connection to these services, the app must use a CA certificate included in a VCAP_SERVICES environment variable.

GOV.UK PaaS will automatically parse the ``VCAP_SERVICES`` [environment variable](/#system-provided-environment-variables) to get details of the  service and then set the `DATABASE_URL` variable to the first database found.

Use ``cf env APPNAME`` to see the app's environment variables and confirm that the variable has been set correctly.

If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with ``cf logs APPNAME --recent``. See the section on [Logs](#logs) for details.

## PostgreSQL maintenance & backups

### PostgreSQL service maintenance times

The PaaS PostgreSQL service is currently provided by Amazon Web Services RDS. Each PostgreSQL service you create will have a randomly-assigned weekly 30 minute maintenance window, during which there may be brief downtime. (To minimise this downtime, select a high availability plan with `HA` in its name).

Minor version upgrades (for example from 9.4.1 to 9.4.2) will be applied during the maintenance window.

For more details, see the [Amazon RDS Maintenance documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html) [external page].

If you need to know the time of the default maintenance window, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). Window start times will vary from 22:00 to 06:00 UTC. You may also, prefer to set your own maintenance window by setting `preferred_maintenance_window` in your custom parameters. It would look something like this:

```
cf update-service postgres PLAN NEW_SERVICE_INSTANCE -c '{"preferred_maintenance_window": "Tue:04:00-Tue:04:30"}'
```

Which essentially would set it to Tuesday morning between 4:00 and 4:30 AM UTC.

For more information about syntax, please reffer to [Amazon RDS Maintenance Documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html#AdjustingTheMaintenanceWindow).

### PostgreSQL service backup

The data stored within any PostgreSQL service you create is backed up using the standard Amazon RDS backup system, except if you are using the free plan.

Backups are taken nightly at some time between 22:00 and 06:00 UTC. Data is retained for 7 days.

There are two ways you can restore data to an earlier state:

1. You can restore to the latest snapshot yourself. See [Restoring a PostgreSQL service snapshot](#restoring-a-postgresql-service-snapshot-experimental) for details.

2. We can manually restore to any point from 5 minutes to 7 days ago, with a resolution of one second. Data can be restored to a new PostgreSQL service instance running in parallel, or it can replace the existing service instance.

    To arrange a manual restore, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). We will need approval from your organization manager if restoring will involve overwriting data.

Note that data restore will not be available in the event of an RDS outage affecting the entire Amazon availability zone.

For more details about how the RDS backup system works, see [Amazon's DB Instance Backups documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.BackingUpAndRestoringAmazonRDSInstances.html) [external page].

### Restoring a PostgreSQL service snapshot (experimental)

You can create a copy of any existing PostgreSQL service instance using the latest snapshot of the RDS instance.
These snapshots are taken during [the nightly backups described above](#postgresql-service-backup).

This can be useful if you want to clone a production database to be used for testing or batch processing.

This feature is experimental; we expect it to work and we'd like people who use it to tell us if it worked for them. It has the following limitations:

 * You can only restore the most recent snapshot from the latest nightly backup
 * You cannot restore from a service instance that has been deleted
 * You must use the same service plan for the copy as for the original service instance
 * You must create the new service instance in the same organisation and space as the original. This is to prevent unauthorised access to data between spaces. If you need to copy data to a different organisation and/or space, you can use [`pg_dump`](https://www.postgresql.org/docs/9.5/static/backup-dump.html) and [`pg_restore`](https://www.postgresql.org/docs/9.5/static/app-pgrestore.html) via [SSH tunnels](#creating-tcp-tunnels-with-ssh).

To restore from a snapshot:

 1. Get the `GUID` of the existing instance by running:

    ``cf service SERVICE_INSTANCE --guid``

    where SERVICE_INSTANCE is the name of the PostgreSQL service instance you want to copy.

    for example:

    ``cf service my-pg-service --guid``

    This returns a `GUID` like `32938730-e603-44d6-810e-b4f12d7d109e`.

 2. Trigger the creation of a new service based on the snapshot with

    ``cf create-service postgres PLAN NEW_SERVICE_INSTANCE -c '{"restore_from_latest_snapshot_of": "GUID"}'``

    where:
      + PLAN is the identifier for the plan used in the original instance; you can find out what this is using `cf service SERVICE_INSTANCE`
      + NEW_SERVICE_INSTANCE is a unique, descriptive name for this new instance (not the name of the original)
      + GUID is the `GUID` from step 1

    For example:

    ``cf create-service postgres M-dedicated-9.5 my-pg-service-copy  -c '{"restore_from_latest_snapshot_of": "32938730-e603-44d6-810e-b4f12d7d109e"}'``

 3. It may take some time (5 to 10 minutes) for the new service instance to be set up. To find out its status, run:

    ``cf service NEW_SERVICE_INSTANCE``

    for example:

    ``cf service my-pg-service-copy``

 4. Once the status reported by the above command is "create succeeded", you can use the instance. See [Setting up a PostgreSQL service](#setting-up-a-postgresql-service) for more details.
