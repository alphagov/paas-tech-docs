# Amazon SQS

Amazon Simple Queue Service (SQS) offers a durable hosted queue that lets you
build decoupled distributed software components.

This is a beta service which is currently in a testing phase. If you would like to test the service, contact the GOV.UK PaaS team at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). 
[gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

<h2 id="set-up-the-service">Set up the service</h2>

### Provision an Amazon Web Service SQS queue

Creating a service instance provisions an Amazon Web Service (AWS) Simple Queue
Service (SQS) queue.

The name of the service overall is `aws-sqs-queue`.

There are two types of plan available for the service:

- `standard`, providing at-least-once delivery,
  where each message is delivered at least once
- `fifo`, for first-in-first-out queues providing [exactly-once processing](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html#FIFO-queues-exactly-once-processing),
  where each message is delivered once and remains available until a
  consumer processes it and deletes it

AWS SQS queues can be configured to move messages that cannot be successfully
processed by your application on a secondary queue, known as a
[dead-letter queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html),
letting you isolate problematic messages to determine why their processing did not succeed.

#### Provision a standard AWS SQS queue

Use a standard queue when the order of the items on your queue is not
important and when your application can tolerate occasional duplication of
messages.

Run the following in the command line to provision a standard AWS SQS queue:

```
cf create-service aws-sqs-queue standard SERVICE_NAME
```

It will take between 1 and 5 minutes to set up the service instance. To check
its progress run:

```
cf service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this SQS queue.

#### Provision a FIFO AWS SQS queue

Use a FIFO (first-in-first-out) queue when the order of operations and events
is critical, or where duplicates cannot be tolerated.

Run the following in the command line to provision a FIFO AWS SQS queue:

```
cf create-service aws-sqs-queue fifo SERVICE_NAME
```

It will take between 1 and 5 minutes to set up the service instance. To check
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

It will take between 1 and 5 minutes to set up the binding. To check its progress, run:

```
cf service SERVICE_NAME
```

where:

- `APP_NAME` is the name of a deployed instance of your app, as specified in your app's manifest or push command
- `SERVICE_NAME` is a unique descriptive name for this SQS queue

When binding an SQS service to your app, you have the option of restricting the
queue permissions given to that app. You can control this using `bind-service`'s `-c`
flag to set the bind parameters `access_policy` JSON key, for example:

```
cf bind-service APP_NAME SERVICE_NAME -c '{"access_policy": "consumer"}'
```

The currently supported `access_policy` values are:

- `full`, which means the default, full access permissions
- `producer`, which is appropriate for an app that will be sending messages to the queue,
  but does not need to be able to read or delete messages
- `consumer`, which is appropriate for an app that will be reading and possibly deleting messages,
  but does not need to be able to send messages to the queue

You can use the [app's manifest](https://docs.cloud.service.gov.uk/deploying_apps.html#deploying-public-apps)
to bind an SQS queue to the app (with default `full` permissions only).
It will bind automatically when you next deploy your app. An example manifest:

```
--
applications:
- name: APP_NAME
  services:
  - SERVICE_NAME
```

<h2 id="use-the-service">Use the service</h2>

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
documentation](https://aws.amazon.com/developer/tools/#sdks), and extract the
credentials from VCAP_SERVICES to provide to the SDK. You can usually do this
either by setting environment variables such as `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY` or `AWS_REGION`, or by providing the SDK with the right
static credentials function call or data as part of your app.

You should use the provided `primary_queue_url` in AWS API calls to make use of
the queue.

Your app may also connect to a second, separate, queue using the `secondary_queue_url`
value, but we recommend ignoring this value unless you are configuring a
dead-letter queue. See [configuring a dead letter queue](#configuring-a-dead-letter-queue).

<h2 id="amend-the-service">Amend the service</h2>

### Updating an AWS SQS queue

#### Setting a message retention period

Messages that have not been consumed by your application will eventually expire
and be removed from the queue.

The default retention period is 4 days.
The maximum allowed retention period is 14 days.

To configure the time that messages are kept on the queue, we can update the
service, specifying the period in seconds:

```
cf update-service SERVICE_NAME -c '{"message_retention_period": 345600}'
```

where `SERVICE_NAME` is the descriptive name for this SQS queue and `345600` is
the message retention period in seconds. You can also pass this parameter at
service creation time.

#### Setting a message delay

The time in seconds for which the delivery of all messages in the queue is delayed.

The default delay is 0 seconds.
The maximum allowed delay is 15 minutes (900 seconds).

To configure the time that messages are delayed we can update the
service, specifying the period in seconds:

```
cf update-service SERVICE_NAME -c '{"delay_seconds": 600}'
```

where `SERVICE_NAME` is the descriptive name for this SQS queue and `600` is
the message delay period in seconds. You can also pass this parameter at
service creation time.

#### Setting a maximum message size

The limit of how many bytes that a message can contain before Amazon SQS rejects it.

The minimum maximum message size is 1,204 bytes (1 KiB).
The maximum and default maximum message size is 262,144 bytes (256 KiB).

To configure the maximum message size for the queue we can update the
service, specifying the size in bytes:

```
cf update-service SERVICE_NAME -c '{"maximum_message_size": 245600}'
```

where `SERVICE_NAME` is the descriptive name for this SQS queue and `245600` is
a size in bytes to allow on the queue. You can also pass this parameter at
service creation time.

#### Setting a receive message wait time

Specifies the duration, in seconds, that the ReceiveMessage action call waits until
a message is in the queue in order to include it in the response, rather than
returning an empty response if a message is not yet available.

The minimum receive message wait time is 0 seconds.
The maximum receive message wait time is 20 seconds.

Short polling is used as the default or when you specify 0 for this property.
For more information, see the [Amazon SQS Long Poll documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html).

To configure the receive wait time for the queue we can update the
service, specifying the period in seconds:

```
cf update-service SERVICE_NAME -c '{"receive_message_wait_time_seconds": 20}'
```

where `SERVICE_NAME` is the descriptive name for this SQS queue and `20` is
a period in seconds to wait for messages for. You can also pass this parameter at
service creation time.

#### Setting a message visibility timeout

The length of time during which a message will be unavailable after a message is
delivered from the queue. This blocks other components from receiving the same
message and gives the initial component time to process and delete the message
from the queue.

The minimum visibility timeout is 0 seconds.
The default visibility timeout is 30 seconds.
The maximum visibility timeout is 12 hours (43,200 seconds).

To configure the visibility timeout for the queue we can update the
service, specifying the period in seconds:

```
cf update-service SERVICE_NAME -c '{"visibility_timeout": 34560}'
```

where `SERVICE_NAME` is the descriptive name for this SQS queue and `34560` is
the message retention period in seconds. You can also pass this parameter at
service creation time.

#### Configuring a dead-letter queue

Sometimes, your application may not be able to process a message from your
primary queue. When this happens it is useful to move messages onto a
secondary queue so they can be investigated later without interfering with the
correct operation of your primary queue.

When your service is configured in this pattern we call the secondary queue a
"dead-letter" queue. To set up this pattern we can configure the number of times
a message is allowed to appear on the primary queue before it is redirected to
the secondary queue.

Run:

```
cf update-service SERVICE_NAME -c '{"redrive_max_receive_count": 3}'
```

where `SERVICE_NAME` is the descriptive name for this SQS queue and `3` is the
number of attempts a message should have on the primary queue before being
redirected to the secondary queue. You can also pass this parameter at service
creation time.

When you bind an app to an AWS SQS queue service instance, you will find credentials for two unique queue URLs:

- `primary_queue_url` is the URL for the main queue
- `secondary_queue_url` is the URL for the secondary queue, now acting as a dead-letter queue

<h2 id="remove-the-service">Remove the service</h2>

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

### Deleting an SQS queue

Run the following in the command line to delete the SQS queue:

```
cf delete-service SERVICE_NAME
```

It can take between 1 and 5 minutes to delete the service instance. To check
its progress, run:

```
cf service SERVICE_NAME
```

where `SERVICE_NAME` is a unique descriptive name for this SQS queue.
