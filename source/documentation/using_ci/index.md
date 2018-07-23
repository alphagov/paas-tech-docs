# Configuring a continuous integration (CI) tool

A continuous integration (CI) tool deploys software automatically to help you deliver new features without breaking existing functionality.

Examples of CI tools include [Jenkins](https://jenkins.io/), [Travis](https://travis-ci.com/), [Circle](https://circleci.com/) and [TeamCity](https://www.jetbrains.com/teamcity/) [external links].

## Choose CI tool

You should choose a CI tool based on criteria such as:

- product features
- support offered
- pricing
- security

We recommend you focus on how the tool encrypts and protects any sensitive information or secrets such as keys, usernames or passwords. You are responsible for the assurance of your own services and information. Refer to the [information assurance](https://www.cloud.service.gov.uk/ia) page for more information.

## Configure your CI tool accounts

You should request one or more dedicated PaaS user accounts for use by your CI service.

Use a different account for each [space](/orgs_spaces_users.html#spaces) you want to deploy to with your CI tool.

Each of these accounts should be assigned a [user role](https://docs.cloud.service.gov.uk/orgs_spaces_users.html#users-and-user-roles) with the minimum permissions needed for completing the required CI tool actions.

The GOV.UK PaaS will lock your credentials if your CI tool makes multiple failed login attempts in a short period of time. See the [Failed login rate limit](/troubleshooting.html#failed-login-rate-limit) section for more information.
