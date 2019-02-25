# Elasticsearch

[Elasticsearch](https://www.elastic.co/) [external link] is an open source full-text RESTful search and analytics engine that allows you to store and search data.

This implementation of Elasticsearch is a request-only private beta trial version of the backing service to gather feedback. This service may not be suitable for everyone. Contact the GOV.UK PaaS team at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to try the Elasticsearch backing service.

Before using Elasticsearch as your primary data store, you should assess if an [ACID-compliant](https://www.techopedia.com/definition/23949/atomicity-consistency-isolation-durability-acid) [external link] backing service such as [PostgreSQL](/deploying_services/postgresql/#postgresql) or [MySQL](/deploying_services/mysql/#mysql) would better meet your needs.

## Set up the service

### Set up an Elasticsearch service

1. Run the following in the command line to see what plans are available for Elasticsearch:

    ```
    cf marketplace -s elasticsearch
    ```

    Here is an example of the output you will see:

    ```
    service plan   description                                                          free or paid
    small-ha-6.x   3 dedicated VMs, 1 CPU per VM, 4GB RAM per VM, 240GB disk space.     paid
    large-ha-6.x   3 dedicated VMs, 2 CPU per VM, 15GB RAM per VM, 1050GB disk space.   paid
    ```

    The following table explains the syntax in this output:

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    |Syntax|Meaning|
    |:---|:---|
    |`ha`|High availability|
    |`X.X`|Version number|
    |`small`|Size of instance|

    <div style="height:1px;font-size:1px;">&nbsp;</div>

    You should use the Elasticsearch 6.x plan, unless there are compatibility issues between Elasticsearch 6.x and your app.

    All high availability (`ha`) plans are suitable for production.

    You should check the size of the available plans against your service needs.

2. Run the following to create a service instance:

    ```
    cf create-service elasticsearch PLAN SERVICE_NAME
    ```


    where `PLAN` is the plan you want, and `SERVICE_NAME` is a unique descriptive name for this service instance. For example:

    ```
    cf create-service elasticsearch small-ha-6.x my-es-service
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
    plan:            small-ha-6.x
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

Refer to the Cloud Foundry documentation on [deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) [external link] for more information.

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

Refer to the Cloud Foundry documentation on [deploying with app manifests](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) [external link] for more information.

## Amend the service

### Upgrade Elasticsearch service plan

You can upgrade your plan using the `cf update-service` command. Run the following in the command line:

```sh
cf update-service SERVICE_NAME -p NEW_PLAN_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this service instance, and `NEW_PLAN_NAME` is the name of your new plan. For example:

```sh
cf update-service my-elasticsearch-service -p small-ha-6.x
```

The plan upgrade will start immediately and finish within an hour. You can check the status of the upgrade by running `cf services`.

## Remove the service

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

## Maintaining the service

### Data classification

You can store data classified up to Official on the GOV.UK PaaS. Refer to the [data security classification documentation](/deploying_services/#data-security-classification) for more information.

### Elasticsearch backups

Aiven automatically backs up all data stored within any Elasticsearch service you create.

Backups are taken every 2 hours. Data is retained for:

- 2 days if you have a `tiny` plan
- 14 days if you have a `small` plan

To restore data to an earlier state, you can visit the [GOV.UK PaaS support page](https://www.cloud.service.gov.uk/support) or contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### Further information

Refer to the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) [external link] for more information.
