# Elasticsearch

[Elasticsearch](https://www.elastic.co/) is an open source full-text RESTful search and analytics engine that allows you to store and search data.

Before using Elasticsearch as your primary data store, you should assess if an [ACID-compliant](https://www.techopedia.com/definition/23949/atomicity-consistency-isolation-durability-acid) backing service such as [PostgreSQL](/deploying_services/postgresql/#postgresql) or [MySQL](/deploying_services/mysql/#mysql) would better meet your needs. Additionally, if using [elasticsearch-py](https://pypi.org/project/elasticsearch), you should check our [Compatibility Notes](#compatibility-notes).

<h2 id="set-up-the-service">Set up the service</h2>

### Set up an Elasticsearch service

1. Run the following in the command line to see what plans are available for Elasticsearch:

    ```
    cf marketplace -e elasticsearch
    ```

    Here is an example of the output you will see:

    ```
    service plan   description                                                          free or paid
    small-ha-7.x   3 dedicated VMs, 1 CPU per VM, 4GB RAM per VM, 240GB disk space.     paid
    large-ha-7.x   3 dedicated VMs, 2 CPU per VM, 15GB RAM per VM, 1050GB disk space.   paid
    ```

    The following table explains the syntax in this output:

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    |Syntax|Meaning|
    |:---|:---|
    |# `ha`|High availability|
    |# `X.X`|Version number|
    |# `small`|Size of instance|

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    All high availability (`ha`) plans are suitable for production.

    You should check the size of the available plans against your service needs.

2. Run the following to create a service instance:

    ```
    cf create-service elasticsearch PLAN SERVICE_NAME
    ```


    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service elasticsearch small-ha-7.x my-es-service
    ```

    It will take between 5 and 10 minutes to set up the service instance. To check its progress, run:

    ```
    cf service SERVICE_NAME
    ```

    for example:

    ```
    cf service my-es-service
    ```

    When `cf service SERVICE_NAME` returns a `create succeeded` status, you have set up the service instance. An example output could be:

    ```
    name:            my-es-service
    service:         elasticsearch
    tags:
    plan:            small-ha-7.x
    description:     Elasticsearch instances provisioned via Aiven
    documentation:
    dashboard:

    There are no bound apps for this service.

    Showing status of last operation from service my-es-service...

    status:    create succeeded
    message:   Last operation succeeded
    started:   2018-08-02T10:17:30Z
    updated:   2018-08-02T10:21:35Z
    ```

### Bind an Elasticsearch service to your apps

To access the cache from the app, you must bind your app to the Elasticsearch service.

1. Use the [app's manifest](/deploying_apps.html#deploying-public-apps) to bind the app to the service instance. It will bind automatically when you next deploy your app. An example manifest:

    ```
    --
    applications:
      - name: my-app
        services:
        - my-es-service
    ```

1. Deploy your app in line with your normal deployment process.

This binds your app to a service instance called `my-es-service`.

Refer to the [Cloud Foundry documentation on deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) for more information.

#### Use the cf bind-service command

Alternatively, you can manually bind your service instance to your app.

1. Run the following:

    ```
    cf bind-service APP_NAME SERVICE_NAME
    ```

    where `APP_NAME` is the exact name of a deployed instance of your application and `SERVICE_NAME` is the name of the service instance you created. For example:

    ```
    cf bind-service my-app my-es-service
    ```

1. Deploy your app in line with your normal deployment process.

Refer to the [Cloud Foundry documentation on deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) for more information.

<h2 id="amend-the-service">Amend the service</h2>

### Upgrade Elasticsearch service plan

You can upgrade your plan using the `cf update-service` command. Run the following in the command line:

```sh
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```sh
cf update-service my-elasticsearch-service -p small-ha-7.x
```

The plan upgrade will start immediately and finish within an hour. You can check the status of the upgrade by running `cf services`.

<h2 id="remove-the-service">Remove the service</h2>

### Unbind an Elasticsearch service from your app

You must unbind the Elasticsearch service before you can delete it. Run the following in the command line:

```
cf unbind-service APP_NAME SERVICE_NAME
```

where `APP_NAME` is your app's deployed instance name as specified in your app's `manifest.yml` or push command, and `SERVICE_NAME` is a unique descriptive name for this service instance, for example:

```
cf unbind-service my-app my-es-service
```

If you unbind your services from your app but do not delete them, the services will persist even after you have deleted your app, and you can re-bind or re-connect to them in future.

### Delete an Elasticsearch service

Once you have unbound the Elasticsearch service from your app, you can delete the service. Run the following in the command line:

```
cf delete-service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

```
cf delete-service my-es-service
```

Enter `yes` when asked for confirmation.

<h2 id="maintaining-the-service">Maintaining the service</h2>

### Data classification

You can store data classified up to Official on the GOV.UK PaaS. Refer to the [data security classification documentation](/deploying_services/#data-security-classification) for more information.

### Elasticsearch backups

Aiven automatically backs up all data stored within any Elasticsearch service you create.

Backups are taken every 2 hours. Data is retained for:

- 2 days if you have a `tiny` plan
- 14 days if you have a `small`, `medium` or `large` plan

To restore data to an earlier state, you can visit the [GOV.UK PaaS support page](https://admin.london.cloud.service.gov.uk/support) or contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### View your Elasticsearch data using Kibana

Aiven provide a Kibana user interface through which you can explore the data in your Elasticsearch. You can access Kibana using the following instructions:

1. Run the following to get some valid credentials for your Elasticsearch:

    ```sh
    cf create-service-key NAME_OF_YOUR_ELASTICSEARCH creds-for-kibana

    cf service-key NAME_OF_YOUR_ELASTICSEARCH creds-for-kibana
    ```

    That outputs a hostname, username and password that you will use later.

2. Set up an SSH tunnel to your target Elasticsearch:

    ```sh
    cf ssh -L 4430:HOSTNAME_FROM_STEP_1:443 NAME_OF_AN_APP_YOU_CAN_SSH_TO
    ```

    Elasticsearch instances are only accessible from the PaaS. This sets up a tunnel so that you can get access, similar to how we use [Conduit](https://github.com/alphagov/paas-cf-conduit) elsewhere.

3. Access Kibana via your browser by going to [https://localhost:4430](https://localhost:4430).
   When prompted for credentials, provide the username and password from step 1.
   If you see a blank page then make sure your browser url is using `https` and not `http`.

4. To clean up when you are done, `CTRL+C` the `cf ssh` session from step 2 and run `cf delete-service-key NAME_OF_YOUR_ELASTICSEARCH creds-for-kibana`.

### IP Restrictions for Elasticsearch

You can add or remove IP restrictions for an Elasticsearch service instance when:

- creating a new service instance
- updating an existing service instance

### Add IP restrictions when creating a service instance

You [create a new Elasticsearch service instance](#set-up-the-service) by running `cf create-service`. You can enable optional IP restrictions in this new service instance by running:

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

For example, your Elasticsearch service instance is named `my-es-service` and you wish to add the IP address `1.2.3.4` to the IP restrictions list. Run the following to add `1.2.3.4`:

```
cf update-service my-es-service -c '{"ip_filter": "1.2.3.4"}'
```

#### Removing IP addresses from an existing service

To remove all IP addresses except the mandatory PaaS ones, pass an empty value in for the `ip_filter` key:

```
cf update-service my-es-service -c '{"ip_filter": ""}'
```

To remove one IP address from a list while keeping the mandatory PaaS ones, pass in the list without the IP address you wish to remove for the `ip_filter` key, for example removing `5.6.7.8` from the list of `1.2.3.4, 5.6.7.8, 9.10.11.12`:

```
cf update-service my-es-service -c '{"ip_filter": "1.2.3.4,9.10.11.12"}'
```

### Compatibility Notes

#### elasticsearch-py

[elasticsearch-py](https://pypi.org/project/elasticsearch) versions `>=7.14.0` are no longer compatible with AWS-managed Elasticsearch instances. Until [Opensearch](https://github.com/opensearch-project) release their fork, you should use [elasticsearch-py `7.13.4`](https://pypi.org/project/elasticsearch/7.13.4/).

The [Department for International Trade](https://github.com/uktrade) have provided more information in a [pull request](https://github.com/uktrade/data-hub-api/pull/3672) on one of their repositories.


### Further information

Refer to the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) for more information.
