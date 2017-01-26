GOV.UK PaaS relies on the Cloud Foundry user management system to determine what each individual tenant user account can do.

Note that the "users" we're talking about here are members of your team who use the command-line tool to manage apps on the PaaS, **not** the end users of your apps.

In this section, we'll cover the most common roles and describe what they mean for how you use the PaaS.

For full details about Cloud Foundry roles, see [the Cloud Foundry documentation](https://docs.cloudfoundry.org/concepts/roles.html) [external link].

## User roles

There are multiple **roles** that a user can have. These are always defined in relation to an [organisation](/deploying_apps/orgs_spaces_targets#organisations) or a [space](/deploying_apps/orgs_spaces_targets#spaces). A user can have different roles in different orgs or spaces. A user can have more than one role within the same org or space.

To find out details of the users in an organisation and their roles, run:

``cf org-users ORGNAME``

where `ORGNAME` is the name of the organisation; use `cf orgs` to find out the names of organisations you can access.

### Space Developer
This role applies within a particular space. 

A Space Developer can push, start and stop apps, and create and bind services. This is the default role for a user who is not a manager.

For example, suppose you have `testing` and `production` spaces. You choose to grant a new junior developer the Space Developer role in the `testing` space, but no role in the `production` space. As a result, the developer can change apps in `testing`, but cannot do anything in `production`.

### Space Manager
This role applies within a particular space. 

A Space Manager can grant user roles within the space, and change properties of the space, such as the name. Being a Space Manager does not grant the ability to change apps or services, so you need the Space Developer role as well if you want to be able to do both things.

For example, suppose you have a senior developer who manages junior developers who work in your `testing` space, and also needs to change apps in both `testing` and `production` spaces. You choose to grant the senior developer the Space Manager role in the `testing` space, and the Space Developer role in both `testing` and `production`. As a result, the developer can add users to `testing` but not to `production`, and can change apps in both spaces.

### Org Manager
This role applies to a particular organisation. Typically, each team only has one organisation, but you can have more than one. 

An Org Manager can create/delete spaces and edit user roles. See the sections on [Managing spaces](/deploying_apps/orgs_spaces_targets#managing-spaces) and [Granting access](/deploying_apps/orgs_spaces_targets#granting-access) for details. 

As an Org Manager, you have responsibilities related to adding and removing users: see the section on [User lifecycle](/managing_users/user_lifecycle).

As part of our onboarding process, we will create an account with the Org Manager role. We recommend you have at least two people who are Org Managers, in case one is unavailable. The Org Managers would typically be senior staff: for example, you might choose to grant the role to your technical architect and a lead developer.

We will treat your Org Managers as our primary contacts for support issues. They will need to approve changes like adding new users, setting quotas and enabling paid services.

If you need the Org Manager role to be added to a user account, contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).
