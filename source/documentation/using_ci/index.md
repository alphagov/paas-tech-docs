# Configuring a custom continuous integration (CI) system

Setting up a CI service lets you make sure your code changes are delivering new features without introducing new bugs or breaking existing functionality. This helps you to iterate code faster and with greater confidence, a huge benefit once the codebase becomes larger and more complex. 
 
For advanced projects that need high levels of control over configuration, a tool like [Jenkins](https://jenkins.io/) is often used. For simpler projects, or where a team needs to manage deployments of prototypes from their github repositories rather than local code, cloud-based services such as [Travis CI](https://travis-ci.com/) or [CircleCI](https://circleci.com/) are common. Instructions to configure both Jenkins and Travis to run on GOV.UK PaaS are below.

Security is a key concern when setting up a CI system that interacts with a PaaS. You should protect confidential data by: 
- running your tests in an isolated environment
- using SSL to encrypt your incoming and outgoing traffic.

Avoid exposing your credentials publicly; you should store them in encrypted form and decrypt only during runtime.

For security reasons, GOV.UK PaaS will lock your account if your CI system makes multiple failed login attempts in a short period of time. This can happen if you provide incorrect or expired login details. See the [Failed login rate limit](#failed-login-rate-limit) section for more information.
