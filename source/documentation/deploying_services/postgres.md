## Using PostgreSQL

GOV.UK PaaS enables you to create a PostgreSQL database service (powered by Amazon Web Services) and bind it to your app.

In Cloud Foundry, each service may have multiple plans available with different characteristics.

Currently, GOV.UK PaaS offers a ``postgres`` service with multiple plans available.

To see the available plans, run:

```
cf marketplace -s postgres
```

Here is a shortened example of the sort of output you will see (the exact plans will vary):

```
service plan             description                                                                                                                                                       free or paid
M-dedicated-9.5          20GB Storage, Dedicated Instance, Max 500 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.large.                                           paid
M-HA-dedicated-9.5       20GB Storage, Dedicated Instance, Highly Available, Max 500 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.large.                         paid
...
Free                     5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.t2.micro.                              free
```

You can look up the ``DB Instance Class``  to find out more detail about what these plans offer on [the AWS Product Details page](https://aws.amazon.com/rds/details/#DB_Instance_Classes).

### Free and paid PostgreSQL plans

Most PostgreSQL plans are paid, meaning that we will bill you based on your usage of the service.

There is a free plan available with limited storage. This should *only* be used for development or testing, not for production.

Paid services may not be enabled for your organisation. If they're not enabled, when you try to set up a paid service, you'll receive the error "service instance cannot be created because paid service plans are not allowed". One of your [Org Managers](/#org-manager) must contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request that we enable paid services.


### High availability plans

We recommend you use one of the high availability plans (indicated by `HA` in the name) for your production apps. These plans use Amazon RDS Multi-AZ instances which are designed to be 99.95% available (see [Amazon's SLA](https://aws.amazon.com/rds/sla/) for details).

When you use the high availability plan, Amazon RDS provides a hot standby service for failover in the event that the original service fails.

The failover process means that Amazon RDS will automatically change the DNS record of the database instance to point to the standby instance. You should make sure that your app doesn't cache the database IP, and any DNS caching should be configured with a low time to live (TTL). Consult the documentation for the language/framework you are using to find out how to do this.

During failover, there will be an outage period (from tens of seconds to a few minutes).

See the [Amazon RDS documentation on the failover process](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) for more details.

You should test how your app deals with a failover to make sure you are benefiting from the high availability plan. We can trigger a failover for you. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to arrange this.

### Encrypted PostgreSQL plans

Plans with ``enc`` in the name include encryption at rest of the database storage. This means that the data on the disk and in snapshots is encrypted.

We recommend that you use an encrypted plan for production services or those that use real data.

Once you've created a service instance, you can't enable or disable encryption. There's no way to convert an unencrypted PostgreSQL service instance to an encrypted one later.

### Read replicas

Amazon RDS has the capability to provide a read replica: a read-only copy of your PostgreSQL database. This can be useful for performance, availability or security reasons.

See the [Amazon RD documentation on read replicas](https://aws.amazon.com/rds/details/read-replicas/) to learn more.

GOV.UK PaaS doesn't currently support read replicas, but if you think you would find them useful, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), providing details of your use case.

### Setting up a PostgreSQL service

To create a service and bind it to your app:

1. From the command line, run:

    ``cf marketplace -s postgres``

    to see details of the available plans.

3. Run:

    ``cf create-service SERVICE PLAN SERVICE_INSTANCE``

    where SERVICE is the service you want, PLAN is the plan you want, and SERVICE_INSTANCE is a unique, descriptive name for this instance of the service; for example:

    ``cf create-service postgres M-dedicated-9.5 my-pg-service``

    Note that for production usage, we recommend you select a high-availability encrypted plan (one with ``HA-enc`` in the name).

3. It may take some time (5 to 10 minutes) for the service instance to be set up. To find out its status, run:

    ``cf service SERVICE_INSTANCE``

    for example:

    ``cf service my-pg-service``

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



5. You can now bind the PostgreSQL service to your app. Run:

    ``cf bind-service APPLICATION SERVICE_INSTANCE``

    where APPLICATION is the name of a deployed instance of your application (exactly as specified in your manifest or push command), and SERVICE_INSTANCE is the name you gave the instance when you created it, for example:

    ``cf bind-service my-app my-pg-service``

5. If the app is already running, you should restage the app to make sure it connects:

    ``cf restage APPLICATION``

6. To confirm that the service is bound to the app, you can run:

    ``cf service SERVICE_INSTANCE``

    and check the ``Bound apps:`` line of the output.


### Accessing PostgreSQL from your app

Your app must make a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the PostgreSQL service. Most libraries use TLS by default.

GOV.UK PaaS will automatically parse the ``VCAP_SERVICES`` [environment variable](/#system-provided-environment-variables) to get details of the  service and then set the `DATABASE_URL` variable to the first database found.

Use ``cf env APPNAME`` to see the app's environment variables and confirm that the variable has been set correctly.

If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with ``cf logs APPNAME --recent``. See the section on [Logs](#logs) for details.

## PostgreSQL maintenance & backups

### PostgreSQL service maintenance times

The PaaS PostgreSQL service is currently provided by Amazon Web Services RDS. Each PostgreSQL service you create will have a randomly-assigned weekly 30 minute maintenance window, during which there may be brief downtime. (To minimise this downtime, select a high availability plan with `HA` in its name).

Minor version upgrades (for example from 9.4.1 to 9.4.2) will be applied during the maintenance window.

For more details, see the [Amazon RDS Maintenance documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html) [external page].

If you need to know the time of your maintenance window, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). Window start times will vary from 22:00 to 06:00 UTC. We will add the ability to set the time of the maintenance window in a future version of GOV.UK PaaS.

### PostgreSQL service backup

The data stored within any PostgreSQL service you create is backed up using the standard Amazon RDS backup system, except if you are using the free plan.

Backups are taken nightly at some time between 22:00 and 06:00 UTC. Data is retained for 7 days.

There are two ways you can restore data to an earlier state:

1. You can restore to the latest snapshot yourself. See [Restoring a PostgreSQL service snapshot](#restoring-a-postgresql-service-snapshot) for details.

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
