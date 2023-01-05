# MySQL

MySQL is an open source relational database management system that uses Structured Query Language (SQL) and is backed by Oracle.

You can access [metrics and logs for this backing service](/monitoring_services.html).

<h2 id="set-up-the-service">Set up the service</h2>

### Set up a MySQL service

To set up a MySQL service:

1. Run the following code in the command line to see what plans are available for MySQL:

    ```
    cf marketplace -e mysql
    ```

    Here is an example of the output you will see (the exact plans will vary):

    ```
    service plan                description                                                                                                                                                       free or paid
    medium-5.7                  100GB Storage, Dedicated Instance. MySQL Version 5.7. DB Instance Class: db.m4.large.                                                                             paid
    medium-ha-5.7               100GB Storage, Dedicated Instance, Highly Available. MySQL Version 5.7. DB Instance Class: db.m4.large.                                                           paid
    ```

    The syntax in this output is explained in the following table:

    |Syntax|Meaning|
    |:---|:---|
    |# `ha`|High availability|
    |# `X.X`|Version number|
    |# `small / medium / large / xlarge`|Size of instance|

    More information can be found in the [MySQL plans](/deploying_services/mysql/#mysql-plans) section.

1. Run the following code in the command line:

    ```
    cf create-service mysql PLAN SERVICE_NAME
    ```

    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service mysql medium-5.7 my-ms-service
    ```

    You should use a high-availability (`ha`) encrypted plan for production apps.

1. It will take between 5 and 10 minutes to set up the service instance. To check its progress, run:

    ```
    cf service SERVICE_NAME
    ```

    for example:

    ```
    cf service my-ms-service
    ```

    The service is set up when the `cf service SERVICE_NAME` command returns a `create succeeded` status. Here is an example of the output you will see:

    ```
    Service instance: my-ms-service
    Service: mysql
    Bound apps:
    Tags:
    Plan: medium-5.7
    Description: AWS RDS MySQL service
    Documentation url: https://aws.amazon.com/documentation/rds/
    Dashboard:

    Last Operation
    Status: create succeeded
    Message: DB Instance 'rdsbroker-9f053413-97a5-461f-aa41-fe6e29db323e' status is 'available'
    Started: 2016-08-23T15:34:41Z
    Updated: 2016-08-23T15:42:02Z
    ```

### Bind a MySQL service to your app

You must bind your app to the MySQL service so you can access the database from the app.

1. Use the [app's manifest](/deploying_apps.html#deploying-public-apps) to bind the app to the service instance. It will bind automatically when you next deploy your app. An example manifest:

    ```
    --
    applications:
      - name: my-app
        services:
        - my-ms-service
    ```
1. Deploy your app in line with your normal deployment process.

This binds your app to a service instance called `my-ms-service`.

Refer to the [Cloud Foundry documentation on deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) for more information.

#### Use the cf bind-service command

Alternatively, you can manually bind your service instance to your app.

1. Run the following:

    ```
    cf bind-service APP_NAME SERVICE_NAME
    ```

    where `APP_NAME` is the exact name of a deployed instance of your application and `SERVICE_NAME` is the name of the service instance you created. For example:

    ```
    cf bind-service my-app my-ms-service
    ```

1. Deploy your app in line with your normal deployment process.

### Connect to a MySQL service from your app

Your app must make a [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the service. Some libraries use TLS by default, but others will need to be manually configured.

GOV.UK PaaS will automatically parse the ``VCAP_SERVICES`` [environment variable](/deploying_apps.html#system-provided-environment-variables) to get details of the service and then set the `DATABASE_URL` variable to the first database found.

If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with `cf logs APP_NAME --recent`. See the section on [logs](/monitoring_apps.html#logs) for details.

Refer to the Guidance section for information on how to securely connect either a [Drupal app](/guidance.html#connect-drupal-to-mysql) or a [Wordpress app](/guidance.html#connect-wordpress-to-mysql) to MySQL using SSL.

### Connect to a MySQL service from your local machine

We have created the [Conduit](/guidance.html#conduit) plugin to simplify the process of connecting your local machine to a MySQL service. To install this plugin, run the following code from the command line:

```
cf install-plugin conduit
```

Once the plugin has finished installing, run the following code in the command line to access an SQL shell for your backing service:

```
cf conduit SERVICE_NAME -- mysql
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.

Run `cf conduit --help` for more options, and refer to the [Conduit README file](https://github.com/alphagov/paas-cf-conduit/blob/master/README.md) for more information on how to use the plugin.

<h2 id="amend-the-service">Amend the service</h2>

### Import and export bulk data to and from a MySQL database

#### Prerequisites

You must:

- install and configure the [MySQL command line (CLI) tools](https://dev.mysql.com/downloads/utilities/) on your local machine (configuration options vary depending on operating system and version)
- [log into Cloud Foundry](/get_started.html#set-up-command-line)
- [create the new PaaS-hosted MySQL database](/deploying_services/mysql/#set-up-a-mysql-service)
- [target the space](/deploying_apps.html#set-a-target) where your new database is located

#### Non-PaaS to PaaS

To move data from a non-PaaS MySQL database to a PaaS MySQL database:

1. Run the following command in the CLI to export data from the non-PaaS database to an SQL data file:

    ```
    mysqldump --set-gtid-purged=OFF --host HOST_NAME --result-file DATA_FILE_NAME DATABASE_NAME
    ```

    where:
    - `HOST_NAME` is the name of your host
    - `DATA_FILE_NAME` is the SQL data file
    - `DATABASE_NAME` is the name of the non-PaaS source database

2. Use the [Conduit plugin](/deploying_services/mysql/#connect-to-a-mysql-service-from-your-local-machine) to import the data file into the PaaS database by running:

    ```
    cf conduit SERVICE_NAME -- mysql < DATA_FILE_NAME
    ```

    where `SERVICE_NAME` is a unique descriptive name for this service instance, and `DATA_FILE_NAME` is the SQL file created in the previous step.

#### PaaS to PaaS

To move data between two PaaS-hosted MySQL databases:

1. Use the [Conduit plugin](/deploying_services/mysql/#connect-to-a-mysql-service-from-your-local-machine) to connect to the source database and export the data into an SQL file by running:

    ```
    cf conduit SERVICE_NAME -- mysqldump --set-gtid-purged=OFF --result-file DATA_FILE_NAME DATABASE_NAME
    ```

    where:
    - `SERVICE_NAME` is a unique descriptive name for this service instance
    - `DATA_FILE_NAME` is the SQL data file name created by the `mysqldump` command
    - `DATABASE_NAME` is the name of the source database (you should get this from the [`VCAP_SERVICES` environment variable](/deploying_services/mysql/#bind-a-mysql-service-to-your-app))

    Depending on the version of your local `mysqldump` tool, you may need to add the flags `--no-tablespaces` and/or `--column-statistics=0` to exclude metadata that cannot be accessed on GOV.UK PaaS from the data dump.

2. Run the following command to import the data file into the target database:

     ```
     cf conduit DESTINATION_SERVICE_NAME -- mysql < DATA_FILE_NAME
     ```

    where `DESTINATION_SERVICE_NAME` is the name of the target database.

Contact the PaaS team at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you have any questions.

### Upgrade MySQL service plan

#### Same encryption type

If your new plan uses the same encryption type as your current plan, you can upgrade your plan using the `cf update-service` command. Run the following in the command line:

```
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```
cf update-service my-ms-service -p medium-ha-5.7
```

The plan upgrade will start immediately and finish within an hour. You can check the status of the upgrade by running `cf services`.

You can also [queue a plan upgrade](/deploying_services/mysql/#queue-a-plan-migration-mysql) to happen during a maintenance window to minimise service interruption.

Amazon automatically patch your database during the configured maintenance
window.
Updates are usually released more regularly than they are automatically
applied.
You can use the `update_minor_version_to_latest` configuration
parameter to update your database to the latest available minor version:

```
cf update-service SERVICE_NAME -c '{"update_minor_version_to_latest": true}'
```

#### Different encryption type

You cannot upgrade your service plan using the `cf update-service` command if the new plan uses a different encryption type to your current plan.

To upgrade, you must set up a new service and migrate your app data.

1. [Set up a new MySQL service](/deploying_services/mysql/#set-up-a-mysql-service) with a new plan that has a different encryption type to your current plan.
1. Move your app data from the current service to the new service by following the [import and export bulk data documentation](/deploying_services/mysql/#paas-to-paas).

#### Downgrade MySQL service plan

You cannot currently downgrade your service plan.

### Reboot a MySQL service instance

You can [reboot your MySQL service instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RebootInstance.html) to:

- try to fix a problem with your service instance
- test how your app behaves during a service instance failure

To reboot your service instance, you must have the [space developer](/orgs_spaces_users.html#space-developer) role and permissions in the [space](/orgs_spaces_users.html#spaces) that hosts your service instance.

Rebooting your service instance will cause a temporary database outage. The length of this outage depends on your service instance’s complexity and configuration.


You should tell your users and your team when a reboot is scheduled.

Run the following in the command line to reboot your service instance:

```
cf update-service SERVICE_NAME -c '{"reboot": true}'
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.


#### Force a failover

If you have a [highly available service instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html), you can force a [failover](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) when you reboot that service instance. You can use this to test how your app behaves when a failover happens.

Run the following to reboot your highly available service and force a failover:

```
cf update-service SERVICE_NAME -c '{"reboot": true, "force_failover": true}'
```

When you force a failover, your MySQL database IP address will change. The database's hostname will not change. You must configure your app to close all database connections to the previous IP address after forcing a failover.

<h2 id="remove-the-service">Remove the service</h2>

### Unbind a MySQL service from your app

You must unbind the MySQL service before you can delete it. To unbind the MySQL service, run the following code in the command line:

```
cf unbind-service APPLICATION SERVICE_NAME
```

where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your app's `manifest.yml` file or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

```
cf unbind-service my-app my-ms-service
```

If you unbind your services from your app but do not delete them, the services will persist even after your app is deleted, and you can re-bind or re-connect to them in future.

### Delete a MySQL service

Once the MySQL service has been unbound from your app, you can delete it. Run the following code in the command line:

```
cf delete-service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.

Type `yes` when asked for confirmation.

<h2 id="maintaining-the-service">Maintaining the service</h2>

### Data classification

You can store data classified up to ‘official’ on the GOV.UK PaaS. Refer to the [data security classification documentation](/deploying_services/#data-security-classification) for more information.

### MySQL plans

Each service in the marketplace has multiple plans that vary by availability and storage capacity.

#### Paid plans - MySQL

Some service plans are paid and we will bill you based on your service usage.

New organisations cannot access paid plans by default. Enabling this access is controlled by an organisation's [quota](/managing_apps.html#quotas) settings.

If paid plans are not enabled, when you try to use a paid service you will receive an error stating “service instance cannot be created because paid service plans are not allowed”. One of your [Org Managers](/orgs_spaces_users.html#org-manager) must contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request that we enable paid services.

There is a free plan available with limited storage which should only be used for development or testing, but not production.

#### Encrypted plans - MySQL

All plans have encryption at rest unless stated otherwise. This means that both the data on the disk and in snapshots is encrypted.

#### High availability plans - MySQL

We recommend you use a high availability (`HA`) plan for your MySQL apps. These plans use Amazon RDS Multi-AZ instances, which are designed to be 99.95% available. See [Amazon's SLA](https://aws.amazon.com/rds/sla/) for details.

When you use a high availability plan, Amazon RDS provides a hot standby service for failover in the event that the original service fails.

Refer to the [Amazon RDS documentation on the failover process](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) for more information.

You should test how your app deals with a failover to make sure you are benefiting from the high availability plan. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to arrange for us to trigger a failover for you.

#### Read replicas - MySQL

Amazon RDS has the capability to provide a read-only copy of your database known as a read replica. This can be useful for performance, availability or security reasons.

Refer to the [Amazon RDS documentation on read replicas](https://aws.amazon.com/rds/details/read-replicas/) for more information.

GOV.UK PaaS does not currently support read replicas, but if you think you would find them useful, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), providing details of your use case.

#### High IOPS plans - MySQL

For services which have a large volume of database reads and writes, GOV.UK PaaS has `high-iops` variants of its MySQL service plans available.

### MySQL maintenance & backups

#### MySQL maintenance times

Each MySQL service you create will have a randomly-assigned weekly 30 minute maintenance window, during which there may be brief downtime. Select a high availability (`HA`) plan to minimise this downtime. Minor version upgrades (for example from 5.7.1 to 5.7.2) are applied during this maintenance window.

You can retrieve the day and time of this maintenance window with the Cloud Foundry CLI (version 8 and above) by running:

```
cf service --params SERVICE_NAME
```

```json
{
  ...
  "preferred_maintenance_window": "sun:23:00-mon:01:30"
  ...
}
```

You can set your own maintenance window by running `cf update-service` in the command line and setting the `preferred_maintenance_window` custom parameter:

```
cf update-service SERVICE_NAME -c '{"preferred_maintenance_window": "START_DAY:START_TIME-END_DAY:END_TIME"}'
```

where `SERVICE_NAME` is a unique, descriptive name for this service instance, for example:

```
cf update-service my-ms-service -c '{"preferred_maintenance_window": "Tue:04:00-Tue:04:30"}'
```

For more information on maintenance times, refer to the [Amazon RDS maintenance documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html).

#### Queue a plan migration - MySQL

Migrating to a new plan may cause interruption to your service instance. To minimise interruption, you can queue the change to begin during a maintenance window by running the following code in the command line:

```
cf update-service SERVICE_NAME -p PLAN -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "START_DAY:START_TIME-END_DAY:END_TIME"}'
```

where `SERVICE_NAME` is a unique, descriptive name for this service instance and `PLAN` is the plan that you are upgrading to, for example:

```
cf update-service my-ms-service -p medium-5.7 -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "wed:03:32-wed:04:02"}'
```

Passing the `preferred_maintenance_window` parameter will alter the default maintenance window for any future maintenance events required for the database instance.

You can only migrate your service if the new plan has the [same encryption type](/deploying_services/mysql/#same-encryption-type) as your current plan.

#### MySQL service backup

The data stored within any MySQL service you create is backed up using the standard Amazon RDS backup system if you are using a paid plan. Your data is not backed up if you are using the unencrypted plans.

Backups are taken nightly at some time between 22:00 and 06:00 UTC. Data is retained for 35 days.

There are two ways you can restore data to an earlier state:

1. You can restore to the latest snapshot. Refer to [Restoring a MySQL service snapshot](/deploying_services/mysql/#restoring-a-mysql-service-snapshot) for details.

1. You can restore to any point from 5 minutes to 35 days ago, with a resolution of one second. Refer to [Restoring a MySQL service from a point in time](/deploying_services/mysql/#restoring-a-mysql-service-from-a-point-in-time) for details.

Note that data restore will not be available in the event of an RDS outage that affects the entire Amazon availability zone.

For more details about how the RDS backup system works, see [Amazon's DB instance backups documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.BackingUpAndRestoringAmazonRDSInstances.html).

#### Restoring a MySQL service snapshot

You can create a copy of any existing MySQL service instance using the latest snapshot of the RDS instance. These snapshots are taken during [the MySQL nightly backups](/deploying_services/mysql/#mysql-service-backup).

This can be useful if you want to clone a production database to be used for testing or batch processing.

To restore from a snapshot:

 1. Get the global unique identifier (GUID) of the existing instance by running the following code in the command line:

    ```
    cf service SERVICE_NAME --guid
    ```

    where `SERVICE_NAME` is the name of the MySQL service instance you want to copy. For example:

    ```
    cf service my-mysql-service --guid
    ```

    This returns a `GUID` in the format `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`, for example `32938730-e603-44d6-810e-b4f12d7d109e`.

 2. Trigger the creation of a new service based on the snapshot by running:

    ```
    cf create-service mysql PLAN NEW_SERVICE_NAME -c '{"restore_from_latest_snapshot_of": "GUID"}'
    ```

    where `PLAN` is the plan used in the original instance (you can find this out by running `cf service SERVICE_NAME`), and `NEW_SERVICE_NAME` is a unique, descriptive name for this new instance. For example:

    ```
    cf create-service mysql small-8.0 my-mysql-service-copy  -c '{"restore_from_latest_snapshot_of": "32938730-e603-44d6-810e-b4f12d7d109e"}'
    ```

 3. It takes between 5 to 10 minutes for the new service instance to be set up. To find out its status, run:

    ```
    cf service NEW_SERVICE_NAME
    ```

    for example:

    ```
    cf service my-mysql-service-copy
    ```

 4. The new instance is set up when the `cf service NEW_SERVICE_NAME` command returns a `create succeeded` status. See [Set up a MySQL service](/deploying_services/mysql/#set-up-a-mysql-service) for more details.

 This feature has the following limitations:

  * You can only restore the most recent snapshot from the latest nightly backup
  * You cannot restore from a service instance that has been deleted
  * You must use the same service plan for the copy as for the original service instance
  * You must create the new service instance in the same organisation and space as the original. This is to prevent unauthorised access to data between spaces. If you need to copy data to a different organisation and/or space, you can [connect to your MySQL instance from a local machine using Conduit](/deploying_services/mysql/#connect-to-a-mysql-service-from-your-local-machine).

By default, the database is restored to the most recent snapshot.
If you need to restore to a snapshot before a certain date and time,
you can use the `restore_from_latest_snapshot_before` parameter.

For example:

```
cf create-service mysql small-8.0 my-mysql-service-copy  -c '{"restore_from_latest_snapshot_of": "32938730-e603-44d6-810e-b4f12d7d109e", "restore_from_latest_snapshot_before": "2020-04-01 13:00:00"}'
```

will create a new database from the most recent snapshot created before April
1st 2020 13:00 UTC.

#### Restoring a MySQL service from a point in time

You can create a copy of any existing MySQL service instance using the
write-ahead log of the RDS instance.  The database generates write-ahead log
checkpoints during normal use and stores them every 5 minutes. You can restore
to a point in time with a resolution of 1 second.

To restore from a point in time:

 1. Get the global unique identifier (GUID) of the existing instance by running the following code in the command line:

    ```
    cf service SERVICE_NAME --guid
    ```

    where `SERVICE_NAME` is the name of the MySQL service instance you want to copy. For example:

    ```
    cf service my-mysql-service --guid
    ```

    This returns a `GUID` in the format `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`, for example `32938730-e603-44d6-810e-b4f12d7d109e`.

 2. Trigger the creation of a new service based on the most recent available point in time by running:

    ```
    cf create-service mysql PLAN NEW_SERVICE_NAME -c '{"restore_from_point_in_time_of": "GUID"}'
    ```

    where `PLAN` is the plan used in the original instance (you can find this out by running `cf service SERVICE_NAME`), and `NEW_SERVICE_NAME` is a unique, descriptive name for this new instance. For example:

    ```
    cf create-service mysql large-8.0 my-mysql-service-copy  -c '{"restore_from_point_in_time_of": "32938730-e603-44d6-810e-b4f12d7d109e"}'
    ```

 3. It takes between 5 to 10 minutes for the new service instance to be set up. To find out its status, run:

    ```
    cf service NEW_SERVICE_NAME
    ```

    for example:

    ```
    cf service my-mysql-service-copy
    ```

 4. The new instance is set up when the `cf service NEW_SERVICE_NAME` command returns a `create succeeded` status. See [Set up a MySQL service](/deploying_services/mysql/#set-up-a-mysql-service) for more details.

 This feature has the following limitations:

  * You cannot restore from a service instance that has been deleted
  * You must use the same service plan for the copy as for the original service
  instance
  * You cannot restore to a point in time prior to the oldest snapshot (35 days ago)
  * You must create the new service instance in the same organisation and space
  as the original. This is to prevent unauthorised access to data between
  spaces. If you need to copy data to a different organisation and/or space,
  you can [connect to your MySQL instance from a local machine using
  Conduit](/deploying_services/mysql/#connect-to-a-mysql-service-from-your-local-machine).

By default, the database is restored to the most recent point in time
checkpoint available.
If you need to restore to a particular point in time,
you can use the `restore_from_point_in_time_before` parameter.

For example:

```
cf create-service mysql large-8.0 my-mysql-service-copy  -c '{"restore_from_point_in_time_of": "32938730-e603-44d6-810e-b4f12d7d109e", "restore_from_point_in_time_before": "2020-10-27 13:00:00"}'
```

will create a new database from the write-ahead logs before October 27th 2020
13:00 UTC.

## Upgrading major versions of MySQL

You can upgrade from one major version to the next by performing a plan upgrade.

You cannot downgrade major MySQL versions.

To perform the plan upgrade, run the following code in the command line:

```
$cf update-service SERVICE_NAME -p PLAN_NAME
Updating service instance accounts-db as <REDACTED>@digital.cabinet-office.gov.uk...
OK

Update in progress. Use 'cf services' or 'cf service SERVICE_NAME' to check operation status.
```

Where `SERVICE_NAME` is the name of the MySQL service instance being upgraded, and `PLAN_NAME` is the name of the plan it should be upgraded to.

When the update process finishes, your database will be upgraded to the version named in the plan.
To confirm that the database upgraded successfully to the right version, use the `cf service SERVICE_NAME` command to show the details:

```
$cf service SERVICE_NAME
Showing info of service SERVICE_NAME in org <redacted> / space <redacted> as <redacted>@digital.cabinet-office.gov.uk...

name:             SERVICE_NAME
service:          mysql
tags:
plan:             PLAN_NAME
description:      AWS RDS MySQL service
documentation:    https://docs.cloud.service.gov.uk/deploying_services/mysql/
dashboard:
service broker:   rds-broker

This service is not currently shared.

Showing status of last operation from service SERVICE_NAME...

status:    update succeeded
message:   DB Instance 'rdsbroker-<redacted>' status is 'available'
started:   2020-12-04T12:58:56Z
updated:   2020-12-04T13:06:23Z

bound apps:
name            binding name   status             message
APP_NAME                       create succeeded

Upgrades are not supported by this broker.
$
```

### Application and database availability during upgrade
Migrating to a new plan may cause interruption to your service instance. To minimise interruption, you can [queue the change to begin during a maintenance window] (https://docs.cloud.service.gov.uk/deploying_services/mysql/#queue-a-plan-migration-mysql).
