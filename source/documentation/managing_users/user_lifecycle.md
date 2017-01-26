Users will need to be added or removed from GOV.UK PaaS as they join or leave your team.

The responsibility for managing the user lifecycle is split between GOV.UK PaaS support and the [Org Managers](/managing_users/user_accounts#org-manager) on your team. 

This section explains what needs to be done to add or delete users.

## Adding users

User account creation is currently handled by our support team.

To add a new user to an existing project, have an Org Manager on your team contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). We'll add the new account and give it access to your `sandbox` space. An Org Manager will then need to [grant access](/deploying_apps/orgs_spaces_targets#granting-access) to additional spaces.

If you are looking to start a new project on the platform, please contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk). We will create an Org Manager account first, so make sure to let us know who should have this responsibility.

## Deleting users

When a team member leaves or stops working on a project, their access rights must be revoked. 

One of your Org Managers must _immediately_ remove all user roles the user has within your orgs and spaces.

The command to remove a space role is:

```
cf unset-space-role USERNAME ORG SPACE ROLE
```

For example, to remove all a user's space roles you might need to run:

```
cf unset-space-role ana@example.com acme sandbox SpaceDeveloper

cf unset-space-role ana@example.com acme dev SpaceDeveloper

cf unset-space-role ana@example.com acme dev SpaceManager
```


If the user is an Org Manager, you will also need to remove that role from all your organisations:

```
cf unset-org-role USERNAME ORG ROLE
```

For example:

```
cf unset-org-role boss@example.com acme OrgManager
```


If the user is only leaving one project, but still needs access on the PaaS to work on other projects in other organisations, nothing more needs to be done. 

If the user no longer needs access to GOV.UK PaaS, then the Org Manager should ask us to completely remove the user account.
