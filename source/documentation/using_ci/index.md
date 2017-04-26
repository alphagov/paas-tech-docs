# Configuring a custom continuous integration (CI) system

Setting up a CI service helps you make sure your team are delivering new features without breaking existing functionality. CI will deploy software automatically, but only if the tests pass. This helps you to iterate code faster and with greater confidence, a huge benefit once the codebase becomes larger and more complex.

Tools we have seen used to manage the tests and deployments include Travis, Circle, TeamCity and Jenkins. Detailed instructions on configuring Travis or Jenkins are below.

- [Travis CI](https://travis-ci.com/) is cloud-based, has a free tier, and is commonly used when a team want to start deploying prototypes from shared GitHub repositories - rather than code running locally on a particular machine. This is equivalent to linking GitHub repositories to Heroku, and takes less than ten minutes. [Set up Travis](#use-travis)
- [Jenkins](https://jenkins.io/) is more complex, needs detailed technical knowledge, and requires its own infrastructure. [Set up Jenkins](#push-an-app-with-jenkins)

Security is a key concern when setting up a CI system that interacts with a PaaS. You should protect confidential data and your systems by:
- running all tests as a low-privilege user
- not exposing your credentials publicly; you should store them in encrypted form and decrypt only during runtime.
- running your tests in a dedicated environment before deploying to production

For security reasons, GOV.UK PaaS will lock your account if your CI system makes multiple failed login attempts in a short period of time. This can happen if you provide incorrect or expired login details. See the [Failed login rate limit](#failed-login-rate-limit) section for more information.
