## Using MySQL

GOV.UK PaaS enables you to create a MySQL database service (powered by Amazon Web Services) and bind it to your app.

In Cloud Foundry, each service may have multiple plans available with different characteristics.

Currently, GOV.UK PaaS offers a ``mysql`` service with multiple plans available.

To see the available plans, run:

```
cf marketplace -s mysql
```

Here is a shortened example of the sort of output you will see (the exact plans will vary):

```
service plan             description                                                                                                                                                       free or paid
M-dedicated-5.7          20GB Storage, Dedicated Instance. MySQL Version 5.7. DB Instance Class: db.m4.large.                                           paid
M-HA-dedicated-5.7       20GB Storage, Dedicated Instance, Highly Available. MySQL Version 5.7. DB Instance Class: db.m4.large.                         paid
...
Free                     5GB Storage, NOT BACKED UP, Dedicated Instance. MySQL Version 5.7. DB Instance Class: db.t2.micro.                              free
```

You can look up the ``DB Instance Class``  to find out more detail about what these plans offer on [the AWS Product Details page](https://aws.amazon.com/rds/details/#DB_Instance_Classes).

### Free and paid MySQL plans

Most MySQL plans are paid, meaning that we will bill you based on your usage of the service.

There is a free plan available with limited storage. This should *only* be used for development or testing, not for production.

Paid services may not be enabled for your organisation. If they're not enabled, when you try to set up a paid service, you'll receive the error "service instance cannot be created because paid service plans are not allowed". One of your [Org Managers](/#org-manager) must contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request that we enable paid services.


### High availability plans

We recommend you use one of the high availability plans (indicated by `HA` in the name) for your production apps. These plans use Amazon RDS Multi-AZ instances which are designed to be 99.95% available (see [Amazon's SLA](https://aws.amazon.com/rds/sla/) for details).

When you use the high availability plan, Amazon RDS provides a hot standby service for failover in the event that the original service fails.

The failover process means that Amazon RDS will automatically change the DNS record of the database instance to point to the standby instance. You should make sure that your app doesn't cache the database IP, and any DNS caching should be configured with a low time to live (TTL). Consult the documentation for the language/framework you are using to find out how to do this.

During failover, there will be an outage period (from tens of seconds to a few minutes).

See the [Amazon RDS documentation on the failover process](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover) for more details.

You should test how your app deals with a failover to make sure you are benefiting from the high availability plan. We can trigger a failover for you. Please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to arrange this.

### Encrypted MySQL plans

Plans with ``enc`` in the name include encryption at rest of the database storage. This means that the data on the disk and in snapshots is encrypted.

We recommend that you use an encrypted plan for production services or those that use real data.

Once you've created a service instance, you can't enable or disable encryption. There's no way to convert an unencrypted MySQL service instance to an encrypted one later.

### Read replicas

Amazon RDS has the capability to provide a read replica: a read-only copy of your MySQL database. This can be useful for performance, availability or security reasons.

See the [Amazon RDS documentation on read replicas](https://aws.amazon.com/rds/details/read-replicas/) to learn more.

GOV.UK PaaS doesn't currently support read replicas, but if you think you would find them useful, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), providing details of your use case.

### Setting up a MySQL service

To create a service and bind it to your app:

1. From the command line, run:

    ``cf marketplace -s mysql``

    to see details of the available plans.

3. Run:

    ``cf create-service SERVICE PLAN SERVICE_INSTANCE``

    where SERVICE is the service you want, PLAN is the plan you want, and SERVICE_INSTANCE is a unique, descriptive name for this instance of the service; for example:

    ``cf create-service mysql M-dedicated-5.7 my-mysql-service``

    Note that for production usage, we recommend you select a high-availability encrypted plan (one with ``HA-enc`` in the name).

3. It may take some time (5 to 10 minutes) for the service instance to be set up. To find out its status, run:

    ``cf service SERVICE_INSTANCE``

    for example:

    ``cf service my-mysql-service``

4. Wait until the service status reported by the above command is 'create succeeded'. Here is an example of the type of output you will see once the service is created:


        Service instance: my-mysql-service
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



5. You can now bind the MySQL service to your app. Run:

    ``cf bind-service APPLICATION SERVICE_INSTANCE``

    where APPLICATION is the name of a deployed instance of your application (exactly as specified in your manifest or push command), and SERVICE_INSTANCE is the name you gave the instance when you created it, for example:

    ``cf bind-service my-app my-mysql-service``

5. If the app is already running, you should restage the app to make sure it connects:

    ``cf restage APPLICATION``

6. To confirm that the service is bound to the app, you can run:

    ``cf service SERVICE_INSTANCE``

    and check the ``Bound apps:`` line of the output.


### Accessing MySQL from your app

Your app must make a [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) connection to the MySQL service. Some libraries use TLS by default, but others will need to be explicitly configured.

GOV.UK PaaS will automatically parse the ``VCAP_SERVICES`` [environment variable](/#system-provided-environment-variables) to get details of the  service and then set the `DATABASE_URL` variable to the first database found.

Use ``cf env APPNAME`` to see the app's environment variables and confirm that the variable has been set correctly.

If your app writes database connection errors to `STDOUT` or `STDERR`, you can view recent errors with ``cf logs APPNAME --recent``. See the section on [Logs](#logs) for details.
