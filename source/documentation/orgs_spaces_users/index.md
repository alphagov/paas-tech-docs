# Managing orgs, spaces and users

![Diagram showing that an org that contains multiple spaces](/documentation/figures/orgs-spaces.png)

Refer to the [case studies](#case-studies) documentation for information on common structures for orgs, spaces and apps.

## Organisations

An organisation, or org, represents a group of users, resources, applications and environments. Each org shares the same resource, quota and custom domain. Orgs usually represent a service or [service team](https://www.gov.uk/service-manual/the-team/what-each-role-does-in-service-team).

The PaaS team creates the first org for a new project, and assigns at least one [org manager](/#org-manager) to that org. If you want to start a new project on the platform, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk), telling us who the org manager(s) should be.

Run `cf orgs` to list the orgs your user account can access:

Run `cf org ORGNAME` to see [quota](/#quotas) information about an org, where `ORGNAME` is the name of the org.

Your user account should belong to at least one org within the PaaS. PaaS will initially assign you one org. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to request more orgs.

## Spaces

An org is divided into one or more spaces. A space is a shared location for app development, deployment and maintenance. Apps and services are pushed to spaces and hosted within them.

For example, you might have spaces for development and production versions of your app. When we set up your org, we create a default sandbox space you can use for experimenting with the PaaS.

Run `cf spaces` to see the spaces you can access in your current org.

[Org managers](/#org-managers) can create new spaces within an org. Run `cf org-users ORGNAME` to find out who has that role, where ORGNAME is the name of the org. You will see a list of users and their roles. You must be a member of that org to see the list of users.

## Users and user roles

Users are members of your team who use the command-line tool to manage apps on the GOV.UK PaaS.

Users are assigned roles which have different permissions for accessing and managing orgs and spaces. A user can have:

- one or multiple roles
- more than one role within the same org or space
- different roles in different orgs and spaces

Run `cf org-users ORGNAME` to find out details of the users in your org, where `ORGNAME` is the name of the org.

Run `cf orgs` to see which orgs you can access.

To change which user accounts have access, your user account must have the Org Manager role.

Although there are multiple roles, the five most common roles are:

- Org manager
- Billing manager
- Space developer
- Space manager
- Space auditor

Refer to the [Cloud Foundry documentation on roles and permissions](https://docs.cloudfoundry.org/concepts/roles.html#roles) for more information on these roles and others.

### Org manager

This role applies within an org.

Every org must have at least one org manager. Org managers are primary contacts for the org.

Org managers manage spaces, users and user roles, and approve org changes such as requesting new quotas and enabling paid services.

We create at least one user account with the org manager role as part of the onboarding process. We recommend you have at least two org managers in case one is unavailable.

If you need the org manager role added to a user account, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

### Billing manager

This role applies within an org.

Billing managers create and manage billing account and payment information. They can also view users and roles.

You should assign a billing manager to your org before your service moves to production. We will send all payment requests to the billing manager. The org manager can also be the billing manager.

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you have any questions.

### Space developer

This role applies within a space.

A space developer can deploy, run and manage apps, and create and bind services. This is the default role for a user who is not a manager.

For example, a space developer in the testing space can only change apps in this space, but cannot do anything in the production space.

### Space manager

This role applies within a space.

A space manager can grant user roles within a space and change space properties. A space manager cannot deploy, run or manage apps or services.

For example, a developer needs to change apps in both testing and production. You grant this developer the space manager role in testing, and the space developer role in both testing and production. That developer can add users to testing but not to production, and can change apps in both spaces.

### Space auditor

This role applies within a space.

Space auditors can view apps, users and resources used within a space, but cannot edit them. This role is useful for viewing app data without modifying it, for example, monitoring time-series metrics data.

## Manage spaces

Org managers and space managers can manage spaces.

Run the following to create a new space:

```
cf create-space SPACENAME -o ORGNAME
```

where `SPACENAME` is the name of the space, and `ORGNAME` is the name of the org.

You will then need to grant access to any user accounts who should be able to use that space.

## Manage user roles

Both org managers and space managers can grant a user access to a space by assigning a role to a user.

### Grant access to a space

Run the following to grant an account access to a space:

```
cf set-space-role USERNAME ORGNAME SPACENAME ROLE
```

where:
- `USERNAME` is the email address the user logs in with when using the command line client
- `ORGNAME` is the name of the org
- `SPACENAME` is the name of the space
- `ROLE` is the user role you are granting to the user of the email address in the `USERNAME` field

For example, to grant your colleague ana@example.com the space developer role in the test space within the acme org, you would run:

```
cf set-space-role ana@example.com acme test SpaceDeveloper
```

### Add or delete users

Org managers must add users to and remove users from GOV.UK PaaS as they join or leave their team.

#### Add users

The org manager can add users to GOV.UK PaaS. Go to the [GOV.UK PaaS admin tool](admin.cloud.service.gov.uk) and select Manage team members.

All new accounts are given access to your org’s sandbox space. An org manager can then grant that account access to other spaces.

#### Delete users

When a team member leaves or stops working on a project, the org manager must revoke that team member’s access rights. The org manager does this by removing all of that team member’s user roles within the team’s orgs and spaces.

Run the following to remove a role within a space:

```
cf unset-space-role USERNAME ORG SPACE ROLE
```

where:

- `USERNAME` is the email address the user logs in with when using the command line client
- `ORGNAME` is the name of the org
- `SPACENAME` is the name of the space
- `ROLE` is the user role you are granting to the user of the email address in the `USERNAME` field

For example, to remove your colleague ana@example.com's space developer role from the sandbox space within the acme org, you would run:

```
cf unset-space-role ana@example.com acme sandbox SpaceDeveloper
```

If the user is an org manager, you will also need to remove that role from all your orgs:

```
cf unset-org-role USERNAME ORGNAME ROLE
```

For example `cf unset-org-role boss@example.com acme OrgManager`.

If the user still needs access on the PaaS to work on other projects, the org manager does not need to do anything more.

If the user no longer needs access to GOV.UK PaaS, then the org manager should ask us to delete the user account.

## Case studies

This section summarises two common structures for orgs and spaces.

There are other ways to structure orgs and spaces, and you can change your existing structure to suit the project you’re working on.

### Model 1

An org represents a service or service team within a government department or business area. Each org has multiple spaces. Spaces represent environments such as development, staging or production. These spaces host apps.

Departments that use this structure include the Department for Business, Energy and Industrial Strategy, and GDS Digital Marketplace.

![Diagram showing that model 1 of orgs, spaces and apps](/documentation/figures/orgs-spaces-model-1.png)

This model has the following advantages:

- it is easy to manage user permissions within each org because spaces that require higher permissions (such as staging or production) are already separated from other spaces that do not have as high a requirement
- developers that do not have security clearances yet can have their access easily restricted if necessary
- each org is equivalent to a business area which makes billing administration simple.

However, there is no reuse of orgs and spaces in this structure, which incurs a time and resource cost.

### Model 2

An org represents an environment such as development, staging or production. Each org has multiple spaces. Spaces represent services or service teams within a government department or business area. These spaces host apps.

Departments that use this structure include the Department for International Trade.

![Diagram showing that model 2 of orgs, spaces and apps](/documentation/figures/orgs-spaces-model-2.png)

This model has the following advantages:

- Users working in a development org cannot submit code that affects production apps.
- Resources and spending between different environments can be more easily controlled.
