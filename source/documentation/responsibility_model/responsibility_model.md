# Know your responsibilities

When you use the GOV.UK PaaS to host your app, both you and the GOV.UK PaaS team have responsibilities. These responsibilities change depending on whether you deploy your app using a:

- standard buildpack
- custom buildpack
- Docker image

Regardless of which buildpack or Docker image you use, the GOV.UK PaaS team is always responsible for keeping the infrastructure your app runs on secure.

## Standard buildpack responsibilities

GOV.UK PaaS provides a set of [standard buildpacks](/deploying_apps.html#buildpacks). If you're new to working in the cloud or have a small development team, we recommend using a standard buildpack to deploy your app. This maximises the support you receive from GOV.UK PaaS.

If you use a standard buildpack, you’re responsible for:

- keeping your app secure
- making sure your app works with new buildpack versions
- redeploying your app so your app uses the latest version of the standard buildpack

The GOV.UK PaaS team is responsible for providing updates and security patches for the:

- build environment
- language runtime
- base operating system libraries
- Linux kernel

## Custom buildpack responsibilities

A standard buildpack may not work for your app, for example if you want to use a language GOV.UK PaaS does not support. You can use a [custom buildpack](/deploying_apps.html#how-to-use-custom-buildpacks) to deploy your app instead of a standard buildpack.

If you use a custom buildpack, you’re responsible for:

- keeping your app secure
- your custom buildpack's security, including your app's build environment and language runtime
- making sure your app works with new operating system versions
- redeploying your app so your app uses the latest operating system libraries

The GOV.UK PaaS team is responsible for providing updates and security patches for the:

- base operating system libraries
- Linux kernel

## Docker image responsibilities

You can use a [Docker image](/deploying_apps.html#deploy-a-docker-image) to deploy your app instead of a buildpack. You can do this if you are already running your app in a Docker image and are migrating your app to the GOV.UK PaaS.

If you use a Docker image, you’re responsible for:

- keeping your app secure
- your Docker image's security, including your app's build environment, language runtime and operating system

The GOV.UK PaaS team is responsible for providing updates and security patches for the Linux kernel.

## Custom buildpacks compared to Docker images

Custom buildpacks have the following advantages over Docker images:

- custom buildpacks provide a standard way of building and staging apps
- custom buildpacks do not depend on a Docker registry such as [Docker Hub](https://hub.docker.com/) being available
- there is a large variety of open source custom buildpacks so your deployment pipeline does not need to include Docker image creation
- buildpacks are designed for 12-factor apps whereas some Docker images may contain databases or other forms of storage that should be provisioned as an external backing service

Docker images have the following advantages over custom buildpacks:

- the same Docker image can be run locally on developer machines or on any Linux-based machine
- exactly the same Docker image can be promoted between environments as an immutable asset, rather than being rebuilt each time
