# Amazon SQS

Amazon SQS provides data object storage through a web service interface.

To provide any feedback on this feature, contact the GOV.UK PaaS team at
[gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

<h2 id="set-up-the-service">Set up the service</h2>

### Provision an Amazon Web Service SQS queue

Creating a service instance provisions an Amazon Web Service (AWS) Simple Queue
Service (SQS) queue.

The name of the service overall is `aws-sqs-queue`. There are two types of plan
available for the service named `standard` and `fifo`.

- `standard` plans configure queues that provide at-least-once delivery,
which means that each message is delivered at least once.
- `fifo` (first-in-first-out) plans configure queues that provide [exactly-once
processing](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html#FIFO-queues-exactly-once-processing),
which means that each message is delivered once and remains available until a
consumer processes it and deletes

AWS SQS queues can be configured to move messages that can not be successfully
processed by your application on a secondary queue, known as a dead-letter
queue, letting you isolate  problematic messages to determine why their
processing doe not succeed.

#### Provision a standard AWS SQS queue

Use a Standard queue when the order of the items on your queue is not
important and when your application can tolerate occasional duplication of
messages.

Run the following in the command line to provision a Standard AWS SQS queue:

```
cf create-service aws-sqs-queue standard SERVICE_NAME
```

It will take between 1 and 5 minuites to set up the service instance. To check
its progress run:

```
cf service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this SQS queue.

#### Provision a FIFO AWS SQS queue

Use a FIFO (first-in-first-out) queue when the order of operations and events
is critical, or where duplicates can't be tolerated.

Run the following in the command line to provision a FIFO AWS SQS queue:

```
cf create-service aws-sqs-queue fifo SERVICE_NAME
```

It will take between 1 and 5 minuites to set up the service instance. To check
its progress run:

```
cf service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this SQS queue.

### Bind an AWS SQS queue to your app

You must bind the SQS queue to your app so you can get credentials to use the
[AWS SQS API](https://docs.aws.amazon.com/cli/latest/reference/sqs/) to read
from and write to the queue.

You can bind an SQS queue using the command line or the manifest file.

Run the following to bind an SQS queue to your app:

```
cf bind-service APP_NAME SERVICE_NAME
```

It will take between 1 and 5 minuites to setting the binding. To check its progress, run:

```
cf service SERVICE_NAME
```

where:

- `APP_NAME` is the name of a deployed instance of your app, as specified in your app's manifest or push command
- `SERVICE_NAME` is a unique descriptive name for this SQS queue

You can use the [app's manifest](https://docs.cloud.service.gov.uk/deploying_apps.html#deploying-public-apps)
to bind an SQS queue to the app with default read and write permissions only.
It will bind automatically when you next deploy your app. An example manifest:

```
--
applications:
- name: APP_NAME
  services:
  - SERVICE_NAME
```

By default, you can only [connect to an SQS queue from your GOV.UK PaaS-hosted app](#connect-to-an-sqs-queue-from-your-app).

To [connect to an SQS queue from outside the GOV.UK PaaS](#connect-to-an-sqs-queue-from-outside-of-the-gov-uk-paas), you must create a service key.

### Connect to an SQS queue from your app

Restart your app to populate your `VCAP_SERVICES` [environment variable](/deploying_apps.html#system-provided-environment-variables)
with the credentials needed to connect to the SQS queue.

An example `VCAP_SERVICES` environment variable:

```
{
 "VCAP_SERVICES": {
  "aws-sqs-queue": [
   {
    "binding_name": null,
    "credentials": {
     "aws_access_key_id": "XXXXXXXXXXXXXXXXXXXX",
     "aws_region": "eu-west-2",
     "aws_secret_access_key": "XXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     "primary_queue_url": "https://XXXXXXXXXXXXX",
     "secondary_queue_url": "https://XXXXXXXXXXXXX"
    },
    "instance_name": "my-queue",
    "label": "aws-sqs-queue",
    "name": "my-queue",
    "plan": "standard",
    "provider": null,
    "syslog_drain_url": null,
    "tags": [
     "sqs"
    ],
    "volume_mounts": []
   }
  ]
 }
}
```

You must pass credentials from your `VCAP_SERVICES` environment variable to
your AWS software development kit (SDK). Use the appropriate [Amazon SDK
documentation](https://aws.amazon.com/developer/tools/#sdks) to do this.

You should use the provided `primary_queue_url` in AWS API calls to make use of
the queue.

Your app may also connect to a second isolated queue using the `secondary_queue_url`
value, however we recommend ignoring this value unless you are configuring a
dead-letter queue. See [configuring a dead letter queue][].

### Connect to an SQS queue from outside of the GOV.UK PaaS

To connect to an SQS queue from outside of the GOV.UK PaaS, you must create a
service key and credentials that allow external access to the queue.

1. Create a service key and credentials to allow external access:

    ```
    cf create-service-key SERVICE_NAME SERVICE_KEY
    ```

    where:

    - `SERVICE_NAME` is the unique descriptive name for the SQS queue
    - `SERVICE_KEY` is a unique descriptive name for the service key

1. Get the service key credentials:

    ```
    cf service-key SERVICE_NAME SERVICE_KEY
    ```

    You will see output similar to the following:

    ```
    {
     "aws_access_key_id": "AWS_ACCESS_KEY",
     "aws_region": "AWS_REGION",
     "aws_secret_access_key": "AWS_SECRET_ACCESS_KEY",
     "primary_queue_url": "PRIMARY_QUEUE_URL"
    }
    ```

    Use these credentials to connect to the SQS queue from outside of the GOV.UK PaaS.

#### Listing and revoking service keys

You can list all service keys for a service by running the following:

```
cf service-keys SERVICE_NAME
```

These credentials persist and do not get automatically deleted when you sign
out of the GOV.UK PaaS. If you do not need these credentials, you should delete
them by running:

```
cf delete-service-key MY_SERVICE MY_KEY
```

### Unbind an SQS queue from your app

Run the following in the command line to unbind the SQS queue from the app:

```
cf unbind-service APP_NAME SERVICE_NAME
```

It can take between 1 and 5 minutes to remove the binding. To check its progress, run:

```
cf service SERVICE_NAME
```

where:

- `APP_NAME` is the name of a deployed instance of your app, as specified in your app's manifest or push command
- `SERVICE_NAME` is a unique descriptive name for this SQS queue

If you unbind the SQS queue from your app but do not delete the queue, that
queue will persist even after you delete your app. You can re-bind or
re-connect to the queue in future.

### Delete an SQS queue

Run the following in the command line to delete the SQS queue:

```
cf delete-service SERVICE_NAME
```

It can take between 1 and 5 minuites to delete the service instance. To check
its progress, run:

```
cf service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this SQS queue.

