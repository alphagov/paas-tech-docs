# OpenSearch

[OpenSearch](https://opensearch.org/) is an open source fork for [Elasticsearch](https://www.elastic.co/) and [Kibana](https://www.elastic.co/kibana/). It is a search and analytics engine that allows you to store and search data.

Before using OpenSearch as your primary data store, you should assess if an [ACID-compliant](https://www.techopedia.com/definition/23949/atomicity-consistency-isolation-durability-acid) backing service such as [PostgreSQL](/deploying_services/postgresql/#postgresql) or [MySQL](/deploying_services/mysql/#mysql) would better meet your needs.
<h2 id="set-up-the-service">Set up the service</h2>

### Set up an OpenSearch service

1. Run the following in the command line to see what plans are available for OpenSearch:

    ```
    cf marketplace -e opensearch
    ```

    Here is an example of the output you will see:

    ```
    plan          description                                                                                                                          free or paid
    small-ha-1    3 dedicated VMs, 1 CPU per VM, 4GB RAM per VM, 240GB disk space.                                                                     paid
    tiny-1        NOT Highly Available, 1 dedicated VM, 1 CPU per VM, 4GB RAM per VM, 80GB disk space. Free for trial orgs. Costs for billable orgs.   free
    medium-ha-1   3 dedicated VMs, 2 CPU per VM, 8GB RAM per VM, 525GB disk space.                                                                     paid
    ```

    The following table explains the syntax in this output:

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    |Syntax|Meaning|
    |:---|:---|
    |# `ha`|High availability|
    |# `X`|Version number|
    |# `small`|Size of instance|

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    All high availability (`ha`) plans are suitable for production.

    You should check the size of the available plans against your service needs.

2. Run the following to create a service instance:

    ```
    cf create-service opensearch PLAN SERVICE_NAME
    ```

    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service opensearch small-ha-1 my-opensearch-service
    ```

    It will take between 5 and 10 minutes to set up the service instance. To check its progress, run:

    ```
    cf service SERVICE_NAME
    ```

    for example:

    ```
    cf service my-opensearch-service
    ```

    When `cf service SERVICE_NAME` returns a `create succeeded` status, you have set up the service instance. An example output could be:

    ```
    name:            my-opensearch-service
    service:         opensearch
    tags:
    plan:            small-ha-1
    description:     OpenSearch instances provisioned via Aiven
    documentation:   https://docs.cloud.service.gov.uk/deploying_services/opensearch/
    dashboard:
    service broker:  aiven-broker

    There are no bound apps for this service.

    Showing status of last operation from service my-opensearch-service...

    status:    create succeeded
    message:   Last operation succeeded
    started:   2018-08-02T10:17:30Z
    updated:   2018-08-02T10:21:35Z
    ```

### Bind an OpenSearch service to your apps

To access the cache from the app, you must bind your app to the OpenSearch service.

1. Use the [app's manifest](/deploying_apps.html#deploying-public-apps) to bind the app to the service instance. It will bind automatically when you next deploy your app. An example manifest:

    ```
    --
    applications:
      - name: my-app
        services:
        - my-opensearch-service
    ```

1. Deploy your app in line with your normal deployment process.

This binds your app to a service instance called `my-opensearch-service`.

Refer to the [Cloud Foundry documentation on deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) for more information.

#### Use the cf bind-service command

Alternatively, you can manually bind your service instance to your app.

1. Run the following:

    ```
    cf bind-service APP_NAME SERVICE_NAME
    ```

    where `APP_NAME` is the exact name of a deployed instance of your application and `SERVICE_NAME` is the name of the service instance you created. For example:

    ```
    cf bind-service my-app my-opensearch-service
    ```

1. Deploy your app in line with your normal deployment process.

Refer to the [Cloud Foundry documentation on deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) for more information.

<h2 id="amend-the-service">Amend the service</h2>

### Upgrade OpenSearch service plan

You can upgrade your plan using the `cf update-service` command. Run the following in the command line:

```sh
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```sh
cf update-service my-opensearch-service -p medium-ha-1
```

The plan upgrade will start immediately and finish within an hour, except for large plans which may take over an hour. You can check the status of the upgrade by running `cf services`.

<h2 id="remove-the-service">Remove the service</h2>

### Unbind an OpenSearch service from your app

You must unbind the OpenSearch service before you can delete it. Run the following in the command line:

```
cf unbind-service APP_NAME SERVICE_NAME
```

where `APP_NAME` is your app's deployed instance name as specified in your app's `manifest.yml` or push command, and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

```
cf unbind-service my-app my-opensearch-service
```

If you unbind your services from your app but do not delete them, the services will persist even after you have deleted your app, and you can re-bind or re-connect to them in future.

### Delete an OpenSearch service

Once you have unbound the OpenSearch service from your app, you can delete the service. Run the following in the command line:

```
cf delete-service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

```
cf delete-service my-opensearch-service
```

Enter `yes` when asked for confirmation.

<h2 id="migrating-from-elasticsearch">Migrating from Elasticsearch</h2>

GOV.UK PaaS will remove support for Elasticsearch in the first quarter of 2022. You need to migrate your existing Elasticsearch services to OpenSearch.

You can migrate from Elasticsearch to OpenSearch by creating an OpenSearch backing service from a backup of an Elasticsearch service.

```
cf create-service opensearch OPENSEARCH_PLAN OPENSEARCH_SERVICE_NAME -c '{"restore_from_latest_backup_of": "ELASTICSEARCH_SERVICE_GUID"}'
```

where:

- `OPENSEARCH_PLAN` is the name of the OpenSearch service plan you want
- `OPENSEARCH_SERVICE_NAME` is a unique descriptive name for the new service instance
- `ELASTICSEARCH_SERVICE_GUID` is the `GUID` (Global Unique Identifier) of an Elasticsearch service instance from which the latest backup will be picked

For example:

```
cf create-service opensearch small-ha-1 my-new-opensearch -c '{"restore_from_latest_backup_of": "32938730-e603-44d6-810e-b4f12d7d109e"}'
```

When you create an OpenSearch backing service in this way, existing data will be available in the OpenSearch service. However new data added to the Elasticsearch service will not be replicated to the OpenSearch service, and vice versa.

Backups are taken hourly, so you should expect up to one hour's worth of data to be missing from the new service. If this will cause problems in your applications, you can migrate the extra data between the two programmatically. OpenSearch and Elasticsearch are API compatible.

You can begin using the OpenSearch service in your app by [unbinding the Elasticsearch service](/deploying_services/elasticsearch/#unbind-an-elasticsearch-service-from-your-app) and [binding the OpenSearch service](#bind-an-opensearch-service-to-your-apps)

<h2 id="maintaining-the-service">Maintaining the service</h2>

### Data classification

You can store data classified up to Official on the GOV.UK PaaS. Refer to the [data security classification documentation](/deploying_services/#data-security-classification) for more information.

### OpenSearch backups

Aiven automatically backs up all data stored within any OpenSearch service you create.

Backups are taken every hour. Data is retained for:

- 2 days if you have a `tiny` plan
- 14 days if you have a `small`, `medium` or `large` plan

To restore data to an earlier state, you can visit the [GOV.UK PaaS support page](https://admin.london.cloud.service.gov.uk/support) or contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### View your OpenSearch data using Kibana

Aiven provide a Kibana user interface through which you can explore the data in your OpenSearch. You can access Kibana using the following instructions:

1. Run the following to get some valid credentials for your OpenSearch:

    ```sh
    cf create-service-key NAME_OF_YOUR_OPENSEARCH creds-for-kibana

    cf service-key NAME_OF_YOUR_OPENSEARCH creds-for-kibana
    ```

    That outputs a hostname, username and password that you will use later.

2. Set up an SSH tunnel to your target OpenSearch:

    ```sh
    cf ssh -L 4430:HOSTNAME_FROM_STEP_1:443 NAME_OF_AN_APP_YOU_CAN_SSH_TO
    ```

   OpenSearch instances are only accessible from the GOV.UK PaaS. This sets up a tunnel so that you can get access, similar to how we use [Conduit](https://github.com/alphagov/paas-cf-conduit) elsewhere.

3. Access Kibana through your browser by going to [https://localhost:4430](https://localhost:4430).
   When prompted for credentials, provide the username and password from step 1.
   If you see a blank page, make sure your browser URL is using `https` and not `http`.

4. To clean up when you are done, `CTRL+C` the `cf ssh` session from step 2 and run `cf delete-service-key NAME_OF_YOUR_OPENSEARCH creds-for-kibana`.

### IP Restrictions for OpenSearch

You can add or remove IP restrictions for an OpenSearch service instance when:

- creating a new service instance
- updating an existing service instance

### Add IP restrictions when creating a service instance

You [create a new OpenSearch service instance](#set-up-the-service) by running `cf create-service`. You can enable optional IP restrictions in this new service instance by running:

```
cf create-service SERVICE_NAME -c '{"ip_filter": "IPADDRESS_1,IPADDRESS_2"}'
```

where:

- `SERVICE_NAME` is a unique descriptive name for this service instance
- `IPADDRESS_1...N` are the IP addresses you wish to add to the new service

#### Add IP restrictions on an existing service instance

When you enable optional extensions in an existing service instance, you must also reboot that service instance.

Run the following to enable optional extensions in an existing service instance:

```
cf update-service SERVICE_NAME -c '{"ip_filter": "IPADDRESS_1,IPADDRESS_2"}'
```

where:

- `SERVICE_NAME` is a unique descriptive name for this service instance
- `IPADDRESS_1...N` are the IP addresses you wish to add to the existing service

For example, your OpenSearch service instance is named `my-opensearch-service` and you wish to add the IP address `1.2.3.4` to the IP restrictions list. Run the following to add `1.2.3.4`:

```
cf update-service my-opensearch-service -c '{"ip_filter": "1.2.3.4"}'
```

#### Removing IP addresses from an existing service

To remove all IP addresses except the mandatory GOV.UK PaaS ones, pass an empty value in for the `ip_filter` key:

```
cf update-service my-opensearch-service -c '{"ip_filter": ""}'
```

To remove one IP address from a list while keeping the mandatory GOV.UK PaaS ones, pass in the list without the IP address you wish to remove for the `ip_filter` key, for example removing `5.6.7.8` from the list of `1.2.3.4, 5.6.7.8, 9.10.11.12`:

```
cf update-service my-opensearch-service -c '{"ip_filter": "1.2.3.4,9.10.11.12"}'
```

### Further information

Refer to the [OpenSearch documentation](https://opensearch.org/docs/latest/) for more information.
