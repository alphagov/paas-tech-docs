# Deploy a backing or routing service

Many 12-factor applications rely on backing services such as a database, an email delivery service or a monitoring system. Routing services can be used to proxy and perform preprocessing on application requests such as caching, rate limiting or authentication.

In Cloud Foundry, backing and routing services are referred to as 'services' and are available through the Cloud Foundry ``cf marketplace`` command. GOV.UK PaaS enables you to create a backing service and bind it to your app. The available backing services are detailed below.

## PostgreSQL

PostgreSQL is an object-relational database management system. It is open source and designed to be extensible.

### Set up a PostgreSQL service

To set up a PostgreSQL service:

1. Run the following code in the command line to see what plans are available for PostgreSQL:

    ```
    cf marketplace -s postgres
    ```

    Here is an example of the output you will see (the exact plans will vary):

    ```
    service plan             description                                                                                                                                                       free or paid
    M-dedicated-X.X          20GB Storage, Dedicated Instance, Max 500 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.m4.large.                                           paid
    M-HA-dedicated-X.X       20GB Storage, Dedicated Instance, Highly Available, Max 500 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.m4.large.                         paid
    ...
    Free                     5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.t2.micro.                              free
    ```

    The syntax in this output is explained in the following table:

    |Syntax|Meaning|
    |:---|:---|
    |`HA`|High availability|
    |`ENC`|Encrypted|
    |`X.X`|Version number|
    |`S / M / L / XL`|Size of instance|

    More information can be found in the [PostgreSQL plans](/#postgresql-plans) section.

1. Run the following code in the command line:

    ```
    cf create-service postgres PLAN SERVICE_NAME
    ```

    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service postgres M-dedicated-9.5 my-pg-service
    ```

    You should use a high-availability (`HA`) encrypted plan for production apps.

1. It will take between 5 and 10 minutes to set up the service instance. To check its progress, run:

    ```
    cf service SERVICE_NAME
    ```

    for example:

    ```
    cf service my-pg-service
    ```

    The service is set up when the `cf service SERVICE_NAME` command returns a `create succeeded` status. Here is an example of the output you will see:

    ```
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
    ```

### Bind a PostgreSQL service to your app

You must bind your app to the PostgreSQL service to be able to access the database from the app.

1. Run the following code in the command line:

    ```
    cf bind-service APPLICATION SERVICE_NAME
    ```

    where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your manifest or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf bind-service my-app my-pg-service
    ```

1. If the app is already running, you should restage the app to make sure it connects:

    ```
    cf restage APPLICATION
    ```

1. To confirm that the service is bound to the app, run:

    ```
    cf service SERVICE_NAME
    ```

    and check the `Bound apps:` line of the output.

    ```
    Service instance: my-pg-service
    Service: postgres
    Bound apps: my-app
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
    ```

1. Run `cf env APPNAME` to see the app's environment variables and confirm that the [VCAP_SERVICES environment variable](/#system-provided-environment-variables) contains the correct service connection details. It should be consistent with this example:

    ```
    {
     "VCAP_SERVICES": {
      "postgres": [
       {
        "binding_name": null,
        "credentials": {
         "host": "rdsbroker-66ecd739-2e98-401a-9e45-17938165be06.c7uewwm9qebj.eu-west-1.rds.amazonaws.com",
         "jdbcuri": "jdbc:postgresql://rdsbroker-66ecd739-2e98-401a-9e45-17938165be06.c7uewwm9qebj.eu-west-1.rds.amazonaws.com:5432/DATABASE_NAME?password=PASSWORD\u0026ssl=true\u0026user=USERNAME",
         "name": "DATABASE_NAME",
         "password": "PASSWORD",
         "port": 5432,
         "uri": "postgres://USERNAME:PASSWORD@rdsbroker-66ecd739-2e98-401a-9e45-17938165be06.c7uewwm9qebj.eu-west-1.rds.amazonaws.com:5432/DATABASE_NAME",
         "username": "USERNAME"
        },
        "instance_name": "SERVICE_NAME",
        "label": "postgres",
        "name": "SERVICE_NAME",
        "plan": "Free",
        "provider": null,
        "syslog_drain_url": null,
        "tags": [
         "postgres",
         "relational"
        ],
        "volume_mounts": []
       }
      ]
     }
    }
    ```

    Your app must make a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the service. Some libraries use TLS by default, but others will need to be explicitly configured.

    GOV.UK PaaS will automatically parse the ``VCAP_SERVICES`` [environment variable](/#system-provided-environment-variables) to get details of the service and then set the `DATABASE_URL` variable to the first database found.

    If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with ``cf logs APPNAME --recent``. See the section on [Logs](#logs) for details.

### Connect to a PostgreSQL service from your local machine

We have created the [Conduit](#conduit) plugin to simplify the process of connecting your local machine to a PostgreSQL service. To install this plugin, run the following code from the command line:

```
cf install-plugin conduit
```

Once the plugin has finished installing, run the following code in the command line to access an SQL shell for your backing service:

```
cf conduit SERVICE_NAME -- psql
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.

Run `cf conduit --help` for more options, and refer to the [Conduit readme file](https://github.com/alphagov/paas-cf-conduit/blob/master/README.md) [external link] for more information on how to use the plugin.

### Import and export bulk data to and from a PostgreSQL database

#### Prerequisites

You must:

- install and configure the [PostgreSQL command line (CLI)](https://postgresapp.com/documentation/cli-tools.html) tools on your local machine (configuration options vary depending on operating system and version)
- [log into Cloud Foundry](/#setting-up-the-command-line)
- [create the new PaaS-hosted PostgreSQL database](/#set-up-a-postgresql-service)
- [target the space](/#setting-a-target) where your new database is located


#### Non-PaaS to PaaS

To move data from a non-PaaS PostgreSQL database to a PaaS PostgreSQL database:

1. Run the following command in the CLI to export data from the non-PaaS database to an SQL data file:

    ```
    pg_dump --host HOST_NAME --file DATA_FILE_NAME DATABASE_NAME
    ```

    where:
      - `HOST_NAME` is the name of your host
      - `DATA_FILE_NAME` is the SQL data file
      - `DATABASE_NAME` is the name of the non-PaaS source database

2. Use the [Conduit plugin](/#connect-to-a-postgresql-service-from-your-local-machine) to import the data file into the PaaS database by running:

    ```
    cf conduit SERVICE_NAME -- psql < DATA_FILE_NAME
    ```

    where `SERVICE_NAME` is a unique descriptive name for this service instance, and `DATA_FILE_NAME` is the SQL file created in the previous step.

> You can only use [certain PostgreSQL extensions](#postgresql-extensions-whitelist).

#### PaaS to PaaS

To move data between two PaaS-hosted PostgreSQL databases:

1. Use the [Conduit plugin](/#connect-to-a-postgresql-service-from-your-local-machine) to connect to the source database and export the data into an SQL file by running:

    ```
    cf conduit SERVICE_NAME -- pg_dump --file DATA_FILE_NAME
    ```

    where `SERVICE_NAME` is a unique descriptive name for this service instance and `DATA_FILE_NAME` is the SQL data file created by the `pg_dump` command.


2. Run the following command to import the data file into the target database:

     ```
     cf conduit DESTINATION_SERVICE_NAME -- psql < DATA_FILE_NAME
     ```

    where `DESTINATION_SERVICE_NAME` is the name of the target database.

Contact the PaaS team at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you have any questions.


### Upgrade PostgreSQL service plan

You can upgrade your service plan (for example, from free to paid high availability) by running `cf update-service` in the command line:

```
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```
cf update-service my-pg-service -p S-HA-dedicated-9.5
```

The plan upgrade will begin immediately and will usually be completed within about an hour. You can check the status of the change by running the `cf services` command.

You can also [queue a plan upgrade](/#queue-a-plan-migration-postgresql) to happen during a maintenance window to minimise service interruption.

Downgrading service plans is not currently supported.

### Unbind a PostgreSQL service from your app

You must unbind the PostgreSQL service before you can delete it. To unbind the PostgreSQL service, run the following code in the command line:

```
cf unbind-service APPLICATION SERVICE_NAME
```

where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your manifest or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

```
cf unbind-service my-app my-pg-service
```

If you unbind your services from your app but do not delete them, the services will persist even after your app is deleted, and you can re-bind or re-connect to them in future.

### Delete a PostgreSQL service

Once the PostgreSQL service has been unbound from your app, you can delete it. Run the following code in the command line:

```
cf delete-service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.

Type `yes` when asked for confirmation.

### PostgreSQL plans

Each service in the marketplace has multiple plans that vary by availability, storage capacity and encryption.

#### Paid plans - PostgreSQL

Some service plans are paid and we can potentially bill you based on your service usage.

New organisations cannot access paid plans by default. Enabling this access is controlled by an organisation's [quota](/#quotas) settings.

If paid plans are not enabled, when you try to use a paid service you will receive an error stating “service instance cannot be created because paid service plans are not allowed”. One of your [Org Managers](/#org-manager) must contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request that we enable paid services.

There is a free plan available with limited storage which should only be used for development or testing, but __not production__.

#### Encrypted plans - PostgreSQL

Plans with `ENC` in the name include encryption at rest of the database storage. This means that both the data on the disk and in snapshots is encrypted.

You should use an encrypted plan for production services or services that use real data.

Once you've created a service instance, you can't enable or disable encryption.

#### High availability plans - PostgreSQL

We recommend you use a high availability plan (`HA`) for your PostgreSQL apps. These plans use Amazon RDS Multi-AZ instances, which are designed to be 99.95% available (see [Amazon's SLA](https://aws.amazon.com/rds/sla/) for details).

When you use a high availability plan, Amazon RDS provides a hot standby service for failover in the event that the original service fails.

Refer to the [Amazon RDS documentation on the failover process](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) for more information.

You should test how your app deals with a failover to make sure you are benefiting from the high availability plan. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to arrange for us to trigger a failover for you.

#### Read replicas - PostgreSQL

Amazon RDS has the capability to provide a read-only copy of your database known as a read replica. This can be useful for performance, availability or security reasons.

Refer to the [Amazon RDS documentation on read replicas](https://aws.amazon.com/rds/details/read-replicas/) for more information.

GOV.UK PaaS doesn't currently support read replicas, but if you think you would find them useful, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), providing details of your use case.

### PostgreSQL maintenance & backups

#### PostgreSQL maintenance times

Each PostgreSQL service you create will have a randomly-assigned weekly 30 minute maintenance window, during which there may be brief downtime. Select a high availability (`HA`) plan to minimise this downtime. Minor version upgrades (for example from 9.4.1 to 9.4.2) are applied during this maintenance window.

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to find out the default time of your maintenance window. Window start times will vary from 22:00 to 06:00 UTC.

You can set your own maintenance window by running `cf update-service` in the command line and setting the `preferred_maintenance_window` custom parameter:

```
cf update-service SERVICE_NAME -c '{"preferred_maintenance_window": "START_DAY:START_TIME-END_DAY:END_TIME"}'
```

where `SERVICE_NAME` is a unique, descriptive name for this service instance, for example:

```
cf update-service my-pg-service -c '{"preferred_maintenance_window": "Tue:04:00-Tue:04:30"}'
```

For more information on maintenance times, refer to the [Amazon RDS Maintenance documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html) [external link].

#### Queue a plan migration - PostgreSQL

Migrating to a new plan may cause interruption to your service instance. To minimise interruption, you can queue the change to begin during a maintenance window by running the following code in the command line:

```
cf update-service SERVICE_NAME -p PLAN -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "START_DAY:START_TIME-END_DAY:END_TIME"}'
```

where `SERVICE_NAME` is a unique, descriptive name for this service instance and `PLAN` is the plan that you are upgrading to, for example:

```
cf update-service my-pg-service -p S-HA-dedicated-9.5 -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "wed:03:32-wed:04:02"}'
```

Passing the `preferred_maintenance_window` parameter will alter the default maintenance window for any future maintenance events required for the database instance.

#### PostgreSQL service backup

The data stored within any PostgreSQL service you create is backed up using the standard Amazon RDS backup system if you are using a paid plan. Your data is not backed up if you are using the free plan.

Backups are taken nightly at some time between 22:00 and 06:00 UTC. Data is retained for 7 days.

There are two ways you can restore data to an earlier state:

1. You can restore to the latest snapshot yourself. See [Restoring a PostgreSQL service snapshot](/#restoring-a-postgresql-service-snapshot) for details.

1. We can manually restore to any point from 5 minutes to 7 days ago, with a resolution of one second. Data can be restored to a new PostgreSQL service instance running in parallel, or it can replace the existing service instance.

    To arrange a manual restore, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). We will need approval from your organization manager if restoring will involve overwriting data.

Note that data restore will not be available in the event of an RDS outage that affects the entire Amazon availability zone.

For more details about how the RDS backup system works, see [Amazon's DB Instance Backups documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.BackingUpAndRestoringAmazonRDSInstances.html) [external page].

#### Restoring a PostgreSQL service snapshot

You can create a copy of any existing PostgreSQL service instance using the latest snapshot of the RDS instance. These snapshots are taken during [the PostgreSQL nightly backups](#postgresql-service-backup).

This can be useful if you want to clone a production database to be used for testing or batch processing.

To restore from a snapshot:

 1. Get the global unique identifier (GUID) of the existing instance by running the following code in the command line:

    ```
    cf service SERVICE_NAME --guid
    ```

    where `SERVICE_NAME` is the name of the PostgreSQL service instance you want to copy. For example:

    ```
    cf service my-pg-service --guid
    ```

    This returns a `GUID` in the format `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`, for example `32938730-e603-44d6-810e-b4f12d7d109e`.

 2. Trigger the creation of a new service based on the snapshot by running:

    ```
    cf create-service postgres PLAN NEW_SERVICE_NAME -c '{"restore_from_latest_snapshot_of": "GUID"}'
    ```

    where `PLAN` is the plan used in the original instance (you can find this out by running `cf service SERVICE_NAME`), and `NEW_SERVICE_NAME` is a unique, descriptive name for this new instance. For example:

    ```
    cf create-service postgres M-dedicated-9.5 my-pg-service-copy  -c '{"restore_from_latest_snapshot_of": "32938730-e603-44d6-810e-b4f12d7d109e"}'
    ```

 3. It takes between 5 to 10 minutes for the new service instance to be set up. To find out its status, run:

    ```
    cf service NEW_SERVICE_NAME
    ```

    for example:

    ```
    cf service my-pg-service-copy
    ```

 4. The new instance is set up when the `cf service NEW_SERVICE_NAME` command returns a `create succeeded` status. See [Set up a PostgreSQL service](#set-up-a-postgresql-service) for more details.

 This feature has the following limitations:

  * You can only restore the most recent snapshot from the latest nightly backup
  * You cannot restore from a service instance that has been deleted
  * You must use the same service plan for the copy as for the original service instance
  * You must create the new service instance in the same organisation and space as the original. This is to prevent unauthorised access to data between spaces. If you need to copy data to a different organisation and/or space, you can [connect to your PostgreSQL instance from a local machine using Conduit](/#connect-to-a-postgresql-service-from-your-local-machine).

### PostgreSQL extensions whitelist

We currently enable the following extensions for PostgreSQL:

- postgis
- uuid-ossp

## MySQL

MySQL is an open source relational database management system that uses Structured Query Language (SQL) and is backed by Oracle.

### Set up a MySQL service

To set up a MySQL service:

1. Run the following code in the command line to see what plans are available for MySQL:

    ```
    cf marketplace -s mysql
    ```

    Here is an example of the output you will see (the exact plans will vary):

    ```
    service plan                description                                                                                                                                                       free or paid
    M-dedicated-5.7             100GB Storage, Dedicated Instance. MySQL Version 5.7. DB Instance Class: db.m4.large.                                                                             paid
    M-HA-dedicated-5.7          100GB Storage, Dedicated Instance, Highly Available. MySQL Version 5.7. DB Instance Class: db.m4.large.                                                           paid
    ...
    Free                        5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version X.X. DB Instance Class: db.t2.micro.                              free
    ```

    The syntax in this output is explained in the following table:

    |Syntax|Meaning|
    |:---|:---|
    |`HA`|High availability|
    |`ENC`|Encrypted|
    |`X.X`|Version number|
    |`S / M / L / XL`|Size of instance|

    More information can be found in the [MySQL plans](/#mysql-plans) section.

1. Run the following code in the command line:

    ```
    cf create-service mysql PLAN SERVICE_NAME
    ```

    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service mysql M-dedicated-5.7 my-ms-service
    ```

    You should use a high-availability (`HA`) encrypted plan for production apps.

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
    Plan: M-dedicated-5.7
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

You must bind your app to the MySQL service to be able to access the database from the app.

1. Run the following code in the command line:

    ```
    cf bind-service APPLICATION SERVICE_NAME
    ```

    where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your manifest or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf bind-service my-app my-ms-service
    ```

1. If the app is already running, you should restage the app to make sure it connects:

    ```
    cf restage APPLICATION
    ```

1. To confirm that the service is bound to the app, run:

    ```
    cf service SERVICE_NAME
    ```

    and check the `Bound apps:` line of the output.

    ```
    Service instance: my-ms-service
    Service: mysql
    Bound apps: my-app
    Tags:
    Plan: M-dedicated-5.7
    Description: AWS RDS MySQL service
    Documentation url: https://aws.amazon.com/documentation/rds/
    Dashboard:

    Last Operation
    Status: create succeeded
    Message: DB Instance 'rdsbroker-9f053413-97a5-461f-aa41-fe6e29db323e' status is 'available'
    Started: 2016-08-23T15:34:41Z
    Updated: 2016-08-23T15:42:02Z
    ```

1. Run `cf env APPNAME` to see the app's environment variables and confirm that the [VCAP_SERVICES environment variable](/#system-provided-environment-variables) contains the correct service connection details. It should be consistent with this example:

    ```
    {
     "VCAP_SERVICES": {
      "mysql": [
       {
        "binding_name": null,
        "credentials": {
         "host": "rdsbroker-9bbd5eac-dcb1-4ddb-bfc6-addcfa085d6a.c7uewwm9qebj.eu-west-1.rds.amazonaws.com",
         "jdbcuri": "jdbc:mysql://rdsbroker-9bbd5eac-dcb1-4ddb-bfc6-addcfa085d6a.c7uewwm9qebj.eu-west-1.rds.amazonaws.com:3306/DATABASE_NAME?user=USERNAME\u0026password=PASSWORD",
         "name": "DATABASE_NAME",
         "password": "PASSWORD",
         "port": 3306,
         "uri": "mysql://USERNAME:PASSWORD@rdsbroker-9bbd5eac-dcb1-4ddb-bfc6-addcfa085d6a.c7uewwm9qebj.eu-west-1.rds.amazonaws.com:3306/DATABASE_NAME?reconnect=true\u0026useSSL=true",
         "username": "USERNAME"
        },
        "instance_name": "SERVICE_NAME",
        "label": "mysql",
        "name": "SERVICE_NAME",
        "plan": "Free",
        "provider": null,
        "syslog_drain_url": null,
        "tags": [
         "mysql",
         "relational"
        ],
        "volume_mounts": []
       }
      ]
     }
    }
    ```

    Your app must make a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the service. Some libraries use TLS by default, but others will need to be explicitly configured. Refer to the Guidance section for information on how to securely connect either a [Drupal app](/#connect-drupal-to-mysql) or a [Wordpress app](https://docs.cloud.service.gov.uk/#connect-wordpress-to-mysql) to MySQL using SSL.

    GOV.UK PaaS will automatically parse the ``VCAP_SERVICES`` [environment variable](/#system-provided-environment-variables) to get details of the service and then set the `DATABASE_URL` variable to the first database found.

    If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with ``cf logs APPNAME --recent``. See the section on [Logs](#logs) for details.

### Connect to a MySQL service from your local machine

We have created the [Conduit](#conduit) plugin to simplify the process of connecting your local machine to a MySQL service. To install this plugin, run the following code from the command line:

```
cf install-plugin conduit
```

Once the plugin has finished installing, run the following code in the command line to access an SQL shell for your backing service:

```
cf conduit SERVICE_NAME -- mysql
```

where `SERVICE_NAME` is a unique descriptive name for this service instance.

Run `cf conduit --help` for more options, and refer to the [Conduit readme file](https://github.com/alphagov/paas-cf-conduit/blob/master/README.md) [external link] for more information on how to use the plugin.

### Import and export bulk data to and from a MySQL database

#### Prerequisites

You must:

- install and configure the [MySQL command line (CLI)](https://dev.mysql.com/downloads/utilities/) tools on your local machine (configuration options vary depending on operating system and version)
- [log into Cloud Foundry](/#setting-up-the-command-line)
- [create the new PaaS-hosted MySQL database](/#set-up-a-mysql-service)
- [target the space](/#setting-a-target) where your new database is located

#### Non-PaaS to PaaS

To move data from a non-PaaS MySQL database to a PaaS MySQL database:

1. Run the following command in the CLI to export data from the non-PaaS database to an SQL data file:

    ```
    mysqldump --host HOST_NAME --result-file DATA_FILE_NAME DATABASE_NAME
    ```

    where:
    - `HOST_NAME` is the name of your host
    - `DATA_FILE_NAME` is the SQL data file
    - `DATABASE_NAME` is the name of the non-PaaS source database

2. Use the [Conduit plugin](/#connect-to-a-mysql-service-from-your-local-machine) to import the data file into the PaaS database by running:

    ```
    cf conduit SERVICE_NAME -- mysql < DATA_FILE_NAME
    ```

    where `SERVICE_NAME` is a unique descriptive name for this service instance, and `DATA_FILE_NAME` is the SQL file created in the previous step.

#### PaaS to PaaS

To move data between two PaaS-hosted MySQL databases:

1. Use the [Conduit plugin](/#connect-to-a-mysql-service-from-your-local-machine) to connect to the source database and export the data into an SQL file by running:

    ```
    cf conduit SERVICE_NAME -- mysqldump --result-file DATA_FILE_NAME DATABASE_NAME
    ```

    where:
    - `SERVICE_NAME` is a unique descriptive name for this service instance
    - `DATA_FILE_NAME` is the SQL data file name created by the `mysqldump` command
    - `DATABASE_NAME` is the name of the source database (you should get this from the [`VCAP_SERVICES` environment variable](/#bind-a-mysql-service-to-your-app))

2. Run the following command to import the data file into the target database:

     ```
     cf conduit DESTINATION_SERVICE_NAME -- mysql < DATA_FILE_NAME
     ```

    where `DESTINATION_SERVICE_NAME` is the name of the target database.

Contact the PaaS team at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you have any questions.

### Upgrade MySQL service plan

You can upgrade your service plan (for example, from free to paid high availability) by running `cf update-service` in the command line:

```
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```
cf update-service my-ms-service -p S-HA-dedicated-5.7
```

The plan upgrade will begin immediately and will usually be completed within about an hour. You can check the status of the change by running the `cf services` command.

You can also [queue a plan upgrade](/#queue-a-plan-migration-mysql) to happen during a maintenance window to minimise service interruption.

Downgrading service plans is not currently supported.

### Unbind a MySQL service from your app

You must unbind the MySQL service before you can delete it. To unbind the MySQL service, run the following code in the command line:

```
cf unbind-service APPLICATION SERVICE_NAME
```

where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your manifest or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

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

### MySQL plans

Each service in the marketplace has multiple plans that vary by availability, storage capacity and encryption.

#### Paid plans - MySQL

Some service plans are paid and we can potentially bill you based on your service usage.

New organisations cannot access paid plans by default. Enabling this access is controlled by an organisation's [quota](/#quotas) settings.

If paid plans are not enabled, when you try to use a paid service you will receive an error stating “service instance cannot be created because paid service plans are not allowed”. One of your [Org Managers](/#org-manager) must contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request that we enable paid services.

There is a free plan available with limited storage which should only be used for development or testing, but __not production__.

#### Encrypted plans - MySQL

Plans with `ENC` in the name include encryption at rest of the database storage. This means that both the data on the disk and in snapshots is encrypted.

You should use an encrypted plan for production services or services that use real data.

Once you've created a service instance, you can't enable or disable encryption.

#### High availability plans - MySQL

We recommend you use a high availability plan (`HA`) for your MySQL apps. These plans use Amazon RDS Multi-AZ instances, which are designed to be 99.95% available (see [Amazon's SLA](https://aws.amazon.com/rds/sla/) for details).

When you use a high availability plan, Amazon RDS provides a hot standby service for failover in the event that the original service fails.

Refer to the [Amazon RDS documentation on the failover process](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) for more information.

You should test how your app deals with a failover to make sure you are benefiting from the high availability plan. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to arrange for us to trigger a failover for you.

#### Read replicas - MySQL

Amazon RDS has the capability to provide a read-only copy of your database known as a read replica. This can be useful for performance, availability or security reasons.

Refer to the [Amazon RDS documentation on read replicas](https://aws.amazon.com/rds/details/read-replicas/) for more information.

GOV.UK PaaS doesn't currently support read replicas, but if you think you would find them useful, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), providing details of your use case.

### MySQL maintenance & backups

#### MySQL maintenance times

Each MySQL service you create will have a randomly-assigned weekly 30 minute maintenance window, during which there may be brief downtime. Select a high availability (`HA`) plan to minimise this downtime. Minor version upgrades (for example from 5.7.1 to 5.7.2) are applied during this maintenance window.

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to find out the default time of your maintenance window. Window start times will vary from 22:00 to 06:00 UTC.

You can set your own maintenance window by running `cf update-service` in the command line and setting the `preferred_maintenance_window` custom parameter:

```
cf update-service SERVICE_NAME -c '{"preferred_maintenance_window": "START_DAY:START_TIME-END_DAY:END_TIME"}'
```

where `SERVICE_NAME` is a unique, descriptive name for this service instance, for example:

```
cf update-service my-ms-service -c '{"preferred_maintenance_window": "Tue:04:00-Tue:04:30"}'
```

For more information on maintenance times, refer to the [Amazon RDS Maintenance documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html) [external link].

#### Queue a plan migration - MySQL

Migrating to a new plan may cause interruption to your service instance. To minimise interruption, you can queue the change to begin during a maintenance window by running the following code in the command line:

```
cf update-service SERVICE_NAME -p PLAN -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "START_DAY:START_TIME-END_DAY:END_TIME"}'
```

where `SERVICE_NAME` is a unique, descriptive name for this service instance and `PLAN` is the plan that you are upgrading to, for example:

```
cf update-service my-ms-service -p S-HA-dedicated-5.7 -c '{"apply_at_maintenance_window": true, "preferred_maintenance_window": "wed:03:32-wed:04:02"}'
```

Passing the `preferred_maintenance_window` parameter will alter the default maintenance window for any future maintenance events required for the database instance.

#### MySQL service backup

The data stored within any MySQL service you create is backed up using the standard Amazon RDS backup system if you are using a paid plan. Your data is not backed up if you are using the free plan.

Backups are taken nightly at some time between 22:00 and 06:00 UTC. Data is retained for 7 days.

We can manually restore to any point from 5 minutes to 7 days ago, with a resolution of one second. Data can be restored to a new MySQL service instance running in parallel, or it can replace the existing service instance.

To arrange a manual restore, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). We will need approval from your organization manager if restoring will involve overwriting data.

Note that data restore will not be available in the event of an RDS outage that affects the entire Amazon availability zone.

For more details about how the RDS backup system works, see [Amazon's DB Instance Backups documentation](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.BackingUpAndRestoringAmazonRDSInstances.html) [external page].

## Redis

Redis is an open source in-memory datastore that can be used as a database cache or message broker. This is a private beta version of the service. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request access to Redis, and we will make you aware of any constraints.

### Set up a Redis service

To set up a Redis service:

1. Run the following in the command line to see what plans are available for Redis:

    ```
    cf marketplace -s redis
    ```

    There is currently only one plan available for Redis:

    ```
    service plan   description                                    free or paid
    tiny           568MB RAM, 1 shard, single node, no failover   free
    ```

1. Run the following to create a service instance:

    ```
    cf create-service redis PLAN SERVICE_NAME
    ```

    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service redis tiny my-redis-service
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
    plan:            tiny
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

You must bind your app to the Redis service to be able to access the cache from the app.

1. Run the following in the command line:

    ```
    cf bind-service APPLICATION SERVICE_NAME
    ```

    where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your manifest or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf bind-service my-app my-redis-service
    ```

1. If the app is already running, you should restage the app to make sure it connects:

    ```
    cf restage APPLICATION
    ```

1. To confirm that the service is bound to the app, run:

    ```
    cf service SERVICE_NAME
    ```

    and check the `bound apps:` line of the output.

    ```
    name:            my-redis-service
    service:         redis
    bound apps:      my-app
    tags:            
    plan:            tiny
    description:     AWS ElastiCache Redis service
    documentation:   
    dashboard:       

    Showing status of last operation from service testing-time...

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

1. Run `cf env APPNAME` to see the app's environment variables and confirm that the [VCAP_SERVICES environment variable](/#system-provided-environment-variables) contains the correct service connection details. Example output:

    ```
    {
     "VCAP_SERVICES": {
      "redis": [
       {
        "binding_name": null,
        "credentials": {
         "host": "clustercfg.cf-u7zpvbwzxmrvu.p9lva7.euw1.cache.amazonaws.com",
         "name": "cf-u7zpvbwzxmrvu",
         "password": "PASSWORD",
         "port": 6379,
         "tls_enabled": true,
         "uri": "rediss://x:PASSWORD@clustercfg.cf-u7zpvbwzxmrvu.p9lva7.euw1.cache.amazonaws.com:6379"
        },
        "instance_name": "my-redis-service",
        "label": "redis",
        "name": "my-redis-service",
        "plan": "tiny",
        "provider": null,
        "syslog_drain_url": null,
        "tags": [
         "elasticache",
         "redis"
        ],
        "volume_mounts": []
       }
      ]
     }
    }
    ```

    Your app must make a [TLS connection](https://en.wikipedia.org/wiki/Transport_Layer_Security) to the service. Some libraries use TLS by default, but others will need to be explicitly configured.

    Your app should parse the data in the `VCAP_SERVICES` environment variable in order to make a secure connection to Redis.

    If your app writes service connection errors to `STDOUT` or `STDERR`, you can view recent errors with ``cf logs APPNAME --recent``. See the section on [Logs](#logs) for details.

### Connect to a Redis service instance from your local machine

We recommend that you use the [Conduit](#conduit) plugin and [stunnel](/#install-and-configure-stunnel) tool to connect your local machine to your Redis service instance. Stunnel is necessary because the Redis command line (CLI) does not support [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security).

#### Prerequisites

You must:

- install the Redis CLI tool on your local machine (this is included in the [standard Redis installation](https://redis.io/download) [external link])
- [log into Cloud Foundry](/#setting-up-the-command-line)
- [target the space](/#setting-a-target) where your Redis service instance is located

#### Install and configure Conduit

1. Run the following command to install the Conduit plugin:

    ```
    cf install-plugin conduit
    ```

1. Start Conduit by running:

    ```
    $ cf conduit SERVICE_NAME
    ```

    where `SERVICE_NAME` is a unique descriptive name for this service instance.

    You will see the following output:

    ```
    service: SERVICE_NAME (redis)
    host: 127.0.0.1
    port: 7081
    username:
    password: REDIS_PASSWORD
    db: DATABASE
    ```

    where `REDIS_PASSWORD` is the password given to you by Conduit.

#### Install and configure stunnel

1. Run the following command to install stunnel:

    ```
    brew install stunnel
    ```

    If you're not on a Mac, or don't have Homebrew, see the [stunnel
    website](https://www.stunnel.org/downloads.html) [external link] for other
    installation options.

1. Create a stunnel configuration file that contains the following text:

    ```ini
    debug=7
    options=NO_SSLv2
    options=NO_SSLv3
    foreground=yes
    pid=/tmp/stunnel.pid
    [redis]
    client = yes
    accept = 127.0.0.1:6379
    connect = 127.0.0.1:7081
    ```

    where:
    - `127.0.0.1:6379` is the default Redis host and port that stunnel will open (you will need to use a different port if you are already running a local Redis service instance)
    - `127.0.0.1:7081` is the default Conduit host and port outputted by the `cf conduit SERVICE_NAME` command

#### Connect your local machine to your Redis service instance

1. Start stunnel by running:

    ```
    stunnel CONFIGURATION_FILE
    ```

1. Connect to your Redis service instance by running:

    ```
    redis-cli -a REDIS_PASSWORD
    ```

    where `REDIS_PASSWORD` is the password outputted by the `cf conduit SERVICE_NAME` command.

You have now connected your local machine to your Redis service instance using Conduit and stunnel. You can test this connection with the Redis [PING](https://redis.io/commands/ping) command:

```
127.0.0.1:6379> PING
```

Run `cf conduit --help` for more options, and refer to the [Conduit readme file](https://github.com/alphagov/paas-cf-conduit/blob/master/README.md) [external link] for more information on how to use the plugin.

Refer to the AWS documentation on [connecting to an encrypted Redis cluster](https://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/GettingStarted.ConnectToCacheNode.html#GettingStarted.ConnectToCacheNode.Redis.Encrypt) [external link] for more information on this process.


### Unbind a Redis service from your app

You must unbind the Redis service before you can delete your service instance. To unbind the Redis service, run the following code in the command line:

```
cf unbind-service APPLICATION SERVICE_NAME
```

where `APPLICATION` is the name of a deployed instance of your application (exactly as specified in your manifest or push command) and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

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

### Redis maintenance & backups

#### Redis maintenance times

Every Redis service has a maintenance window of Sunday 11pm to Monday 1:30am UTC every week. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you require a different maintenance window.

For more information on maintenance times, refer to the [Amazon ElastiCache maintenance window documentation](https://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/VersionManagement.MaintenanceWindow.html) [external link].

#### Redis service backup

The data stored within any Redis service instance you create is backed up using the Amazon ElastiCache backup system. Backups are taken every day between 2am and 5am UTC. Data is retained for 7 days, and stored in [Amazon S3](https://aws.amazon.com/s3/) [external link].

To restore from the __latest__ backup of your Redis service instance, create a new service instance by running the following code:

```
cf create-service redis PLAN NEW_SERVICE_NAME -c '{ "restore_from_latest_snapshot_of": "GUID" }'
```

where `PLAN` is the name of the plan, `NEW_SERVICE_NAME` is the name of your new service instance, and `GUID` is the UUID of the pre-existing backed-up instance. Get the `GUID` by running `cf service --guid SERVICE_NAME`.

To restore from an older backup, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

For more details about how the backup system works, see the [Amazon's ElastiCache backups documentation](https://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/backups-automatic.html) [external link].

### Redis key eviction policy

The eviction policy is the behaviour Redis follows when you reach your plan's maximum memory limit. The eviction policy can take the following values:

|Eviction policy|Definition|
|:---|:---|
|`volatile-lru`| evict keys by trying to remove the least recently used (LRU) keys first, but only among keys that have an expire set, in order to make space for the new data added|
|`allkeys-lru`| evict keys by trying to remove the least recently used (LRU) keys first, in order to make space for the new data added|
|`allkeys-random`| evict keys randomly in order to make space for the new data added|
|`volatile-random`| evict keys randomly in order to make space for the new data added, but only evict keys with an expire set|
|`volatile-ttl`| evict keys with an expire set, and try to evict keys with a shorter time to live (TTL) first, in order to make space for the new data added|
|`noeviction`| return errors when the memory limit was reached and the client is trying to execute commands that could result in more memory to be used|

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

## MongoDB

MongoDB is an open source cross-platform document-oriented database program. It uses JSON-like documents with schemas, and is often used for content management such as articles on [GOV.UK](https://www.gov.uk/). This is a private beta trial version of the service that is available on request so that we can get feedback. This service may not be suitable for everyone, so [contact the PaaS team](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you want information on how to enable and use this service for your app. We will make you aware of any constraints in its use at that time.

### TLS connection to MongoDB

MongoDB uses self-signed certificates. In order for your app to verify a TLS connection to this service, the app must use a CA certificate included in a `VCAP_SERVICES` environment variable.

## Elasticsearch

Elasticsearch is an open source full text RESTful search and analytics engine that allows you to store and search data. This is a private beta trial version of the service that is available on request so that we can get feedback. This service may not be suitable for everyone, so [contact the PaaS team](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you want information on how to enable and use this service for your app. We will make you aware of any constraints in its use at that time.

### TLS connection to Elasticsearch

Elasticsearch uses self-signed certificates. In order for your app to verify a TLS connection to this service, the app must use a CA certificate included in a VCAP_SERVICES environment variable.

## User-provided services

Cloud Foundry enables tenants to define their own external services that are not available in the marketplace by using a [user-provided service instance](https://docs.cloudfoundry.org/devguide/services/user-provided.html) [external link]. They can be used to deliver service credentials to an application, and/or to trigger streaming of application logs to a syslog compatible consumer. Once created, user-provided service instances behave like service instances created through the marketplace.

If you need a particular backing service that we don't yet support, please let us know at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).
