# Guidance

## Buildpacks
If you're relatively new to cloud or have a small development team, we recommend using the standard buildpacks to maximise the support you will receive from GOV.UK PaaS.

Using a custom buildpack will mean increased development and maintenance responsibilities and costs for you. If your language is not supported by standard buildpacks, we recommend that for a community supported custom buildpack that is maintained and updated by that community. We do not recommend that you create your own buildpack.

We are keen to help where we can, so please contact us if you are interested in this feature. If a custom buildpack is requested by multiple tenants, we will look to improving our support in this area.

### Responsibilities

Your responsibilities differ depending on whether you use a standard buildpack, custom buildpack or Docker image to deploy your app.

#### Standard buildpack
You are only responsible for the app code and its dependencies.

#### Custom buildpacks

You are responsible for managing this custom buildpack as well as the app code and its dependencies. This applies both in setting up the app, and running it in production.

When setting up the app:

- Do your own due diligence on finding a maintained and supported custom buildpack so that you have a community to call upon in the case of problems
- Test deploying with the buildpack early in your build process, not just before go-live

When running the app in production:

- Ensure you have sufficient time to fix issues yourself as using them for deadline-driven development may be risky
Regularly maintain your buildpack to update your runtime and dependencies as new security vulnerabilities are discovered and fixed
- We may not be able to offer support for P1 or out-of-hours incidents; standard SLAs will not apply

#### Docker images

You are responsible for your Docker container and custom image. Learn about this [experimental feature](https://docs.cloud.service.gov.uk/#deploy-a-docker-image-experimental).

### Custom buildpacks compared to Docker images

Custom buildpacks provide some advantages over choosing a Docker solution:

- they are not dependent on a Docker registry such as [Docker Hub](https://hub.docker.com/) being available
- large variety of open source buildpacks, meaning your deployment pipeline doesn’t need to include Docker image creation
- buildpacks are designed for 12-factor apps; some Docker images may contain databases or other forms of storage that should be provisioned as an external backing service

Docker images also provide some advantages over custom buildpacks:

- the same image can be run locally on developer machines, or on any Linux-based machine
- exactly the same Docker image can be promoted between environments as an immutable asset, rather than being rebuilt each time (CF support for this is still experimental)
