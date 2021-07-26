# Accessing Cloud Foundry audit events

[Cloud Foundry](https://www.cloudfoundry.org/) provides an audit trail for you to see actions taken against different GOV.UK Platform-as-a-Service (PaaS) components, such as apps, backing services, and route services.

The [Cloud Foundry documentation on audit events](https://docs.cloudfoundry.org/running/managing-cf/audit-events.html) lists the different audit events and provides information about the structure of the events.

PaaS tenants can access audit events through either through PaaS Admin or the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/getting-started.html), which keeps events for 31 days. 

The internal GOV.UK Platform-as-a-Service (PaaS) auditing database, which tenants cannot access directly, records events from 2019 onwards. If you require access to logs older than 31 days, [raise a support ticket](https://admin.london.cloud.service.gov.uk/support/contact-us) to get assistance from the PaaS team.


## Accessing audit events through GOV.UK PaaS Admin 

You can use GOV.UK PaaS Admin to see a list of audit events at space level, app level and backing service level in the PaaS architecture. You can [view the information on the architecture in PaaS](https://docs.cloud.service.gov.uk/orgs_spaces_users.html) if you need to. 

### View audit events at space level

1. Go to the list of organisations.
1. Choose an organisation.
1. Choose a space.
1. Select the Events tab.

You’ll then see a list of events for all apps and backing services in the space.

### View audit events at app level

1. Go to the list of organisations.
1. Choose an organisation.
1. Choose a space.
1. Choose an app.
1. Select the Events tab.

You’ll then see a list of events for that app.

### View audit events at backing service level

1. Go to the list of organisations.
1. Choose an organisation.
1. Choose a space.
1. Select the Backing services tab.
1. Choose a backing service.
1. Select the Events tab.

You’ll then see a list of events for that backing service.

## Accessing audit events through the Cloud Foundry CLI

### View app events using the Cloud Foundry CLI

You can get a list of [app events](#descriptions-of-audit-events) using the [cf CLI](https://docs.cloudfoundry.org/cf-cli/getting-started.html). You can use one of the following:

- Cloud Foundry’s built-in `cf events` command 
- query the Cloud Foundry API using `cf curl`

Note that the Cloud Foundry V2 API `cf events` endpoint has been deprecated in the Cloud Foundry V3 API. You should instead use the `/audit_events` endpoint.

#### Use Cloud Foundry’s `cf events` command to view app events

From the Cloud Foundry CLI, run `cf events APP_NAME`, where APP_NAME is the name of the app.

```
$ cf events APP_NAME
Getting events for app APP_NAME in org ORG / space SPACE as USER...
time                          			event                         		actor   description
2021-06-21T03:03:27.00+0100	audit.app.deployment.create 	admin   
2021-06-21T03:03:27.00+0100	audit.app.droplet.mapped      	admin   
2021-06-21T03:03:27.00+0100	audit.app.revision.create     	admin   
2021-06-21T03:03:20.00+0100   	audit.app.droplet.create      	admin   
2021-06-21T03:03:17.00+0100   	audit.app.build.create        	admin   
```

#### Use API query `cf curl` to view app events 

You can use `cf curl` to query the [`/audit_events` API endpoint](http://v3-apidocs.cloudfoundry.org/version/3.101.0/index.html#list-audit-events). 

You’ll need to get the Globally Unique Identifier (GUID) of an app. To get the `APP_GUID`, run `cf app APP_NAME --guid` and replace  APP_NAME with the name of the app.

From the Cloud Foundry CLI, run the following command and replace `APP_GUID` with the GUID of the app:

```
cf curl “ /v3/audit_events?target_guids=APP_GUID”
```

### View backing service events using the Cloud Foundry CLI

Use `cf curl` to query [the `/audit_events` API endpoint](http://v3-apidocs.cloudfoundry.org/version/3.101.0/index.html#list-audit-events). 

You’ll need to get the GUID of a backing service. You can find the `BACKING_SERVICE_GUID` by running `cf service BACKING_SERVICE_NAME --guid`, where `BACKING_SERVICE_NAME` is the name of the backing service.

From the Cloud Foundry CLI, run the following command and replace `BACKING_SERVICE_GUID` with the GUID of the backing service:

```
cf curl “ /v3/audit_events?target_guids=BACKING_SERVICE_GUID”
```


## Descriptions of audit events


| Event | Description |
|---------|----------------|
| app.crash | Application crashed |
| audit.app.build.create | Created a build |
| audit.app.copy-bits | Duplicated application source code |
| audit.app.create | Created application |
| audit.app.delete-request | Requested deletion of application |
| audit.app.droplet.create | Created application droplet |
| audit.app.droplet.delete | Deleted application droplet |
| audit.app.droplet.download | Downloaded application droplet |
| audit.app.droplet.mapped | Assigned application droplet to application |
| audit.app.map-route | Mapped a route to this application |
| audit.app.package.create | Created application package |
| audit.app.package.delete | Deleted application package |
| audit.app.package.download | Downloaded application package |
| audit.app.package.upload | Uploaded application package |
| audit.app.process.crash | Application process crashed |
| audit.app.process.create | Created application process |
| audit.app.process.delete | Deleted application process |
| audit.app.process.scale | Scaled application process |
| audit.app.process.terminate_instance | Terminated application process |
| audit.app.process.update | Updated application process |
| audit.app.restage | Restaged application |
| audit.app.ssh-authorized | SSH access (authorized) |
| audit.app.ssh-unauthorized | SSH access (unauthorized) |
| audit.app.start | Started application |
| audit.app.stop | Stopped application |
| audit.app.task.cancel | Cancelled task |
| audit.app.task.create | Created task |
| audit.app.unmap-route | Unmapped route to application |
| audit.app.update | Updated application |
| audit.app.upload-bits | Uploaded application source code |
| audit.route.create | Created route |
| audit.route.delete-request | Requested deletion of route |
| audit.route.update | Updated route |
| audit.service.create | Created service |
| audit.service.delete | Deleted service |
| audit.service.update | Updated service |
| audit.service_binding.create | Bound service to application |
| audit.service_binding.delete | Deleted binding between service and application |
| audit.service_broker.create | Created service broker |
| audit.service_broker.delete | Deleted service broker |
| audit.service_broker.update | Updated service broker |
| audit.service_instance.bind_route | Bound route service to route |
| audit.service_instance.create | Created service instance |
| audit.service_instance.delete | Deleted service instance |
| audit.service_instance.unbind_route | Unbound route service from route |
| audit.service_instance.update | Updated service instance |
| audit.service_key.create | Created service key |
| audit.service_key.delete | Deleted service key |
| audit.service_plan.create | Created service plan |
| audit.service_plan.delete | Deleted service plan |
| audit.service_plan.update | Updated service plan |
| audit.space.create | Created space |
| audit.space.delete-request | Requested deletion of space |
| audit.space.role.add | Added role to user |
| audit.space.role.remove | Removed role from user |
| audit.space.update | Updated space |
| audit.user_provided_service_instance.create | Created user provided service |
| audit.user_provided_service_instance.delete | Deleted user provided service |
| audit.user_provided_service_instance.update | Updated user provided service |

