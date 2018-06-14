# Managing organisations, spaces and users

## Organisations

An organisation, or org, represents a group of users, applications and environments. Each org shares the same resource, quota and custom domain.

The PaaS team creates the first org for a new project, and assigns at least 1 [org manager](/#org-manager) to that org. If you want to start a new project on the GOV.UK PaaS, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), telling us who the org manager(s) should be.

Run `cf orgs` to list the orgs your user account can access.

To see [quota](/#quotas) information about an org, you can either:

- run `cf org ORGNAME`, where `ORGNAME` is the name of the org
- select the appropriate org in the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) (requires sign in) and check the __Memory__ total in the top right corner of the screen

Your user account will be initially assigned to 1 org by the PaaS team and then you can choose to belong to additional orgs. You can contact [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request more orgs.


## Spaces

An org is divided into 1 or more spaces. A space is a shared location for developing, deploying and running apps and backing services.

For example, you might have separate spaces for the development and production versions of your app. When we set up your org, we create a default sandbox space you can use for experimenting with the PaaS.

To see the spaces you can access in your current org, you can either:

- run `cf spaces` in the command line
- sign into the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) and select the appropriate org

[Org managers](/#org-managers) can create new spaces within an org. 

![Diagram showing an org that contains multiple spaces](/documentation/figures/orgs-spaces.png)

Refer to the [case studies](#case-studies) documentation for information on common structures for orgs, spaces and apps.

## Users and user roles

Users are members of your team who can access or manage apps and backing services on the PaaS.

Users are assigned roles which have different permissions for accessing and managing orgs and spaces. A user can have one or multiple roles within the same or different orgs and spaces.

To see a list of users and their roles in your org, you can either:

- run `cf org-users ORGNAME`, where `ORGNAME` is the name of the org
- select the Members screen for the appropriate org in the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) (requires sign in)

Your user account must have the [org manager role](#org-manager) to manage user accounts in an org.

Although there are multiple roles, the 5 most common are:

- Org manager
- Billing manager
- Space developer
- Space manager
- Space auditor

Refer to the [Cloud Foundry documentation on roles and permissions](https://docs.cloudfoundry.org/concepts/roles.html#roles) [external link] for more information on these roles and others.

### Org manager

This role applies within an org.

Every org must have at least 1 org manager. Org managers are primary contacts for the org.

Org managers manage spaces, users and user roles, and approve org changes such as requesting new quotas and enabling paid services.

Org managers can invite new users to an org using the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) (requires sign in) without needing to contact the GOV.UK PaaS team.

We create at least 1 user account with the org manager role as part of your onboarding process. We recommend you have at least 2 org managers in case 1 is unavailable.

If you need the org manager role added to a user account, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### Billing manager

This role applies within an org.

Billing managers create and manage billing account and payment information. They can also view users and roles using either the command line or the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) (requires sign in).

You should assign a billing manager to your org before your service moves to production. We will send all payment requests to the billing manager. An org manager can also be a billing manager.

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you have any questions.

### Space developer

This role applies within a space.

A space developer can deploy, run and manage apps, and create and bind services. This is the default role for any user who is not assigned a manager role.

For example, a space developer granted access to the testing space only can change apps in this space. However, that developer cannot do anything in the production space because they do not have access to this space.

### Space manager

This role applies within a space.

A space manager can grant user roles within a space using either the command line or the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) (requires sign in). A space manager can also change space properties. A space manager cannot deploy, run or manage apps or services.

For example, a team member needs to change apps in both the testing and production spaces. The org manager grants this team member the space manager role in the testing space, and the space developer role in both the testing and production spaces. That team member can add users to testing but not to production (as a space manager), and can change apps in both spaces (as a space developer).

### Space auditor

This role applies within a space.

Space auditors can view apps, users and resources used within a space using either the command line or the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login) (requires sign in), but cannot edit them. This role is useful for viewing app data without modifying it, for example, monitoring time-series metrics data.

## Manage orgs, spaces and user roles

There are several common tasks to manage spaces and user roles. 

### Create a new space

Org managers can create spaces.

Run the following to create a new space:

```
cf create-space SPACE -o ORGNAME
```

where `SPACE` is the name of the space, and `ORGNAME` is the name of the org.

You then need to grant access to any user accounts who should be able to use that space.

### Add users to a space

Both org managers and space managers can grant a user access to a space by assigning a role to a user.

To grant a user account access to a space, you can use the GOV.UK PaaS admin tool:

1. Sign into the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login).
1. Select the appropriate org.
1. Select __View and manage team members__.
1. Select __Invite a new team member__.
1. Complete the form and select __Send invitation__.


Alternatively, you can run the following in the command line:

```
cf set-space-role USERNAME ORGNAME SPACE ROLE
```

where:

- `USERNAME` is the email address the user signs in with when using the command line client
- `ORGNAME` is the name of the org
- `SPACE` is the name of the space
- `ROLE` is the user role you are granting to the user of the email address in the `USERNAME` field

For example, to grant your colleague ana@example.com the space developer role in the test space within the acme org, you would run:

```
cf set-space-role ana@example.com acme test SpaceDeveloper
```

Refer to the [Cloud Foundry reference guide on `cf set-space-role`](https://cli.cloudfoundry.org/en-US/cf/set-space-role.html) for a complete list of roles.

### Remove users from a space

When a team member leaves or stops working on a project, the org manager must revoke that team member’s access rights. 

The org manager can use the GOV.UK PaaS admin tool to remove all of the team member’s user roles within the team’s spaces:

1. Sign into the [GOV.UK PaaS admin tool](https://login.cloud.service.gov.uk/login).
1. Select the appropriate org.
1. Select __View and manage team members__.
1. Select the appropriate user.
1. Change the user’s space roles and select __Save role changes__.


Alternatively, the org manager can run the following in the command line:

```
cf unset-space-role USERNAME ORGNAME SPACE ROLE
```

where:

- `USERNAME` is the email address the user signs in with when using the command line client
- `ORGNAME` is the name of the org
- `SPACE` is the name of the space
- `ROLE` is the user role granted to the user of the email address in the `USERNAME` field

For example, to remove your colleague ana@example.com's space developer role from the sandbox space within the acme org, you would run:

```
cf unset-space-role ana@example.com acme sandbox SpaceDeveloper
```

Refer to the [Cloud Foundry reference guide on `cf unset-space-role`](https://cli.cloudfoundry.org/en-US/cf/unset-space-role.html) for a complete list of roles.

### Invite users to an org

Org managers must add users to their org when they join their team:

1. Sign into the [GOV.UK PaaS admin tool](https://admin.cloud.service.gov.uk).
1. Select the appropriate org.
1. Select __View and manage team members__.
1. Select __Invite a new team member__.
1. Complete the form and select __Send invitation__.

### Remove users from an org

When a team member leaves or stops working on a project, your org manager must revoke that team member’s access rights. Your org manager does this by [removing all of that team member’s user roles within the team’s spaces](/#remove-users-from-a-space). 

If the team member has an org role such as org manager or billing manager, you will also need to remove that team member's roles from all of your orgs. 

Use the GOV.UK PaaS admin tool to remove all of the team member’s user roles within the team’s org:

1. Sign into the [GOV.UK PaaS admin tool](https://admin.cloud.service.gov.uk).
1. Select the appropriate org.
1.Select __View and manage team members__.
1. Select the appropriate user.
1. Change the user’s org roles and select __Save role changes__.

Alternatively, you can also run the following in the command line:

```
cf unset-org-role USERNAME ORGNAME ROLE
```

where:

- `USERNAME` is the email address the user logs in with when using the command line client
- `ORGNAME` is the name of the org
- `ROLE` is the user role granted to the user of the email address in the `USERNAME` field

For example, to remove your colleague ana@example.com's org manager role from the acme org, you would run:

```
cf unset-org-role ana@example.com acme OrgManager
```

If the user still needs access on the PaaS to work on other projects, your org manager does not need to do anything more.

If the user no longer needs access to GOV.UK PaaS, then your org manager should contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to ask us to delete the user account.

Refer to the [Cloud Foundry documentation on creating and managing users with the CLI](https://docs.cloudfoundry.org/adminguide/cli-user-management.html) [external link] for more information.


## Case studies

This section summarises 2 common models for orgs and spaces.

There are other ways to structure orgs and spaces, and you can change your existing structure to suit the project you’re working on.

### Model 1

In this example model, an org represents a service or service team within a government department or business area. Each org has multiple spaces. Spaces represent environments such as development, staging or production. These spaces host apps.

Departments or government teams that use this structure include:

- Department for Business, Energy and Industrial Strategy
- GDS Digital Marketplace

![Diagram showing model 1 of orgs, spaces and apps](/documentation/figures/orgs-spaces-model-1.png)

This model has the following advantages:

- it is easy to manage user permissions within each org because spaces that require higher permissions (such as staging or production) are already separated from other spaces that do not have as high a requirement
- developers that do not have security clearances yet can have their access restricted if necessary
- each org represents a business area which makes billing administration simple

However, there is no reuse of orgs and spaces in this structure, which incurs a time and resource cost.

### Model 2

In this example, an org represents an environment such as development, staging or production. Each org has multiple spaces. Spaces represent services or service teams within a government department or business area. These spaces host apps.

Departments that use this structure include the Department for International Trade.

![Diagram showing model 2 of orgs, spaces and apps](/documentation/figures/orgs-spaces-model-2.png)

This model makes it easier to control resources and spending between different environments.
