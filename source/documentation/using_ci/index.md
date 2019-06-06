# Configuring a continuous integration (CI) tool

A continuous integration (CI) tool deploys software automatically to help you deliver new features without breaking existing functionality.

Examples of CI tools include [Jenkins](https://jenkins.io/), [Travis](https://travis-ci.com/), [Circle](https://circleci.com/), and [TeamCity](https://www.jetbrains.com/teamcity/).

## Choose CI tool

You should choose a CI tool based on criteria such as:

- product features
- support offered
- pricing
- security

You should focus on how the tool encrypts and protects any sensitive information or secrets such as keys, usernames or passwords. You are responsible for the [assurance of your own services and information](https://www.cloud.service.gov.uk/ia).

## Configure your CI tool accounts

You should create one or more dedicated PaaS user accounts for use by your CI tool.

Use a different account for each [space](/orgs_spaces_users.html#spaces) you want to deploy your app to using your CI tool.

Assign a [user role](https://docs.cloud.service.gov.uk/orgs_spaces_users.html#users-and-user-roles) to each of these accounts. These user roles should have the minimum permissions needed for setting up Travis to automatically build and deploy your app.

The GOV.UK PaaS will lock your credentials if your CI tool makes [multiple failed login attempts in a short period of time](/troubleshooting.html#failed-login-rate-limit).
