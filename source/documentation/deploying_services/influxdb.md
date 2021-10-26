# InfluxDB

[InfluxDB](https://www.influxdata.com/) is an open source time series database that allows you to store, index and search time series data.

<h2 id="set-up-the-service">Set up the service</h2>

### Set up an InfluxDB service

1. List the plans available for InfluxDB by running:

    ```
    cf marketplace -e influxdb
    ```


    Here is an example of the output you will see (the exact plans will vary):

    ```
    service plan   description                                                                            free or paid
    tiny-1.x       NOT Highly Available, 1 dedicated VM, 2 CPU per VM, 4GB RAM per VM, 16GB disk space.   free
    small-1.x      NOT Highly Available, 1 dedicated VM, 2 CPU per VM, 8GB RAM per VM, 50GB disk space.   paid
    ```

    The following table explains the syntax in this output:

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    |Syntax|Meaning|
    |:---|:---|
    |# `small`|Size of instance|
    |# `X.X`|Version number|

    <div style="height:1px;font-size:1px;">&nbsp;</div>


    Refer to the [InfluxDB plans](/deploying_services/influxdb/#influxdb-plans) section of the documentation for more information.

2. Create a service instance:

    ```
    cf create-service influxdb tiny-1.x SERVICE_NAME
    ```


    where `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service influxdb tiny-1.x my-influxdb-service
    ```

    It will take between 5 and 10 minutes to set up the service instance. To check its progress, run:

    ```
    cf service SERVICE_NAME
    ```

    for example:

    ```
    cf service my-influxdb-service
    ```

    When `cf service SERVICE_NAME` returns a `create succeeded` status, you have set up the service instance. An example output could be:

    ```
    name:            my-influxdb-service
    service:         influxdb
    tags:
    plan:            tiny-1.x
    description:     InfluxDB instances provisioned via Aiven
    documentation:
    dashboard:

    There are no bound apps for this service.

    Showing status of last operation from service my-influxdb-service...

    status:    create succeeded
    message:   Last operation succeeded
    started:   2019-11-18T10:17:30Z
    updated:   2019-11-18T10:21:35Z
    ```

### Bind an InfluxDB service to your apps using an app manifest

You must bind your app to the InfluxDB service to access the InfluxDB database from your app.

1. Use the [app's manifest](/deploying_apps.html#deploying-public-apps) to bind the app to the service instance. It will bind automatically when you next deploy your app.

1. Deploy your app in line with your normal deployment process.

Refer to the [Cloud Foundry documentation on deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) for more information.

### Bind an InfluxDB service to your apps using cf bind-service

If your app does not have a manifest file, you can manually bind your service instance to your app.

1. Run the following:

    ```
    cf bind-service APP_NAME SERVICE_NAME
    ```


    where:
      - `APP_NAME` is the exact name of a deployed instance of your app
      - `SERVICE_NAME` is the name of the service instance you created

    For example:


    ```
    cf bind-service my-app my-influxdb-service
    ```

1. Deploy your app in line with your normal deployment process.

<h2 id="use-the-service">Use the service</h2>

### Read and write data to InfluxDB

When you create an InfluxDB service instance, the service broker automatically creates a database called `defaultdb`.

`defaultdb` is the only database within the InfluxDB service instance you have permissions to use. If you try to read or write data to another database, you will get an error message.

When reading from and writing to InfluxDB you must specify the database as `defaultdb`.

If you’re using the [InfluxDB HTTP API](https://docs.influxdata.com/influxdb/v1.7/tools/api/) directly, you must specify the database using the `db` query parameter. For example, `db=defaultdb`.

If you’re using an [API client library](https://docs.influxdata.com/influxdb/v1.7/tools/api_client_libraries/), you must specify the database as `defaultdb` using your library's configuration.

### Using InfluxDB with Prometheus

[Prometheus](https://prometheus.io) is an open source tool for collecting metrics.

Prometheus is, by default, a stateful app that relies on local storage. You cannot run stateful apps using local storage on GOV.UK PaaS.

Without local storage, Prometheus metrics will not persist after the Prometheus [app restarts](/managing_apps.html#app-restarts). To store Prometheus metrics for longer, you configure Prometheus to send metrics to InfluxDB for storage.

1. Run Prometheus as an app on GOV.UK PaaS and [bind that app to an InfluxDB service instance](#bind-an-influxdb-service-to-your-apps).

1. the `prometheus.yml` configuration file, make sure the [`remote_read`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read) and [`remote_write`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write) sections match the same sections in the `VCAP_SERVICES` environment variable.

<h2 id="amend-the-service">Amend the service</h2>

### Upgrade InfluxDB service plan

You can upgrade your plan using the `cf update-service` command. Run the following in the command line:

```sh
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```sh
cf update-service my-influxdb-service -p medium-1.x
```

The plan upgrade will start immediately and finish within an hour. You can check the status of the upgrade by running `cf services`.

<h2 id="remove-the-service">Remove the service</h2>

### Unbind an InfluxDB service from your app

You must unbind the InfluxDB service before you can delete it:

```
cf unbind-service APP_NAME SERVICE_NAME
```

where:

- `APP_NAME` is your app's deployed instance name as specified in your app's `manifest.yml` or push command
- `SERVICE_NAME` is a unique descriptive name for this service instance

For example:

```
cf unbind-service my-app my-influxdb-service
```

If you unbind your service from your app but do not delete it, the service will persist even after you have deleted your app. You can re-bind or re-connect to it in future.

### Delete an InfluxDB service

Once you have unbound the InfluxDB service from your app, you can delete the service:

```
cf delete-service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

```
cf delete-service my-influxdb-service
```

<%= warning_text('Deleting the InfluxDB service also deletes your InfluxDB data. This includes any backups that Aiven has taken.') %>


### IP Restrictions for InfluxDB

You can add or remove IP restrictions for an InfluxDB service instance when:

- creating a new service instance
- updating an existing service instance

### Add IP restrictions when creating a service instance

You [create a new InfluxDB service instance](#set-up-the-service) by running `cf create-service`. You can enable optional IP restrictions in this new service instance by running:

```
cf create-service SERVICE_NAME -c '{"ip_filter": "IPADDRESS_1,IPADDRESS_2"}'
```

where:

- `SERVICE_NAME` is a unique descriptive name for this service instance
- `IPADDRESS_1...N` are the IP addresses you wish to add to the new service

#### Add IP restrictions on an existing service instance

Run the following to enable optional extensions in an existing service instance:

```
cf update-service SERVICE_NAME -c '{"ip_filter": "IPADDRESS_1,IPADDRESS_2"}'
```

where:

- `SERVICE_NAME` is a unique descriptive name for this service instance
- `IPADDRESS_1...N` are the IP addresses you wish to add to the existing service

For example, your InfluxDB service instance is named `my-influx-service` and you wish to add the IP address `1.2.3.4` to the IP restrictions list. Run the following to add `1.2.3.4`:

```
cf update-service my-influx-service -c '{"ip_filter": "1.2.3.4"}'
```

#### Removing IP addresses from an existing service

To remove all IP addresses except the mandatory PaaS ones, pass an empty value in for the `ip_filter` key:

```
cf update-service my-influx-service -c '{"ip_filter": ""}'
```

To remove one IP addresses from a list while keeping the mandatory PaaS ones, pass in the list without the IP address you wish to remove for the `ip_filter` key, for example removing `5.6.7.8` from the list of `1.2.3.4, 5.6.7.8, 9.10.11.12`:

```
cf update-service my-influx-service -c '{"ip_filter": "1.2.3.4,9.10.11.12"}'
```



<h2 id="maintaining-the-service">Maintaining the service</h2>

### Data classification

You can store data classified up to Official on the GOV.UK PaaS. Refer to the [data security classification documentation](/deploying_services/#data-security-classification) for more information.

### InfluxDB plans

Each service in the marketplace has multiple plans that vary by availability and storage capacity.

#### Free plan - InfluxDB

There is a free plan available with limited storage. This plan should only be used for development or testing and should not be used for production.

#### Paid plans - InfluxDB

Some service plans are paid and we will bill you based on your service usage.

New organisations cannot access paid plans by default. Enabling this access is controlled by an organisation's [quota](/managing_apps.html#quotas) settings.

If paid plans are not enabled, when you try to use a paid service you will receive an error stating “service instance cannot be created because paid service plans are not allowed”. One of your [Org Managers](/orgs_spaces_users.html#org-manager) must contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request that we enable paid services.



### InfluxDB backups

[Aiven](https://aiven.io) automatically backs up all data stored within any InfluxDB service you create.

Aiven takes backups every 12 hours and keeps 2 backups at a time.

To restore data to an earlier state, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).
