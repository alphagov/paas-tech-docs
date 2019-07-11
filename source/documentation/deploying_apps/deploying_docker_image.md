## Deploy a Docker image

This section explains how to deploy an app from a Docker image. The role of the Docker image is to serve as a packaging format and the requirements for the app and its runtime environment are the same as for apps deployed using buildpacks. Configuration via manifest.yml also stays the same, albeit you should not specify buildpack. If you do, it will be ignored, which can create some confusion to anyone reading the manifest. Our platform currently supports deploying from the following:

* Docker Hub
* [Docker Trusted Registry](https://docs.docker.com/datacenter/dtr/2.1/guides/) [external page] servers
* Docker registries that require authentication

Pushing local Docker images isn't supported.

To deploy an app using a Docker image stored in Docker Hub via CF cli:

``cf push myapp --docker-image dockerhuborg/app_image:tag``

To deploy an app using a Docker image stored in Docker Trusted Registry (DTR) via CF cli:

``cf push myapp --docker-image MY-PRIVATE-REGISTRY.DOMAIN:5000/image/name:tag``

To deploy an app using a Docker image stored in a registry that requires authentication, follow the [Cloud Foundry Docker image documentation instructions](https://docs.cloudfoundry.org/devguide/deploy-apps/push-docker.html#private-repo).

You might notice that the staging process is simplified when deploying from a Docker image - this is because there is no need to build the app from the pushed code using a buildpack. Also, the buildpack for apps deployed from a Docker image will be reported as `unknown` in the app information (``cf app <myapp>``).

There are a few more specifics about Docker image support in Cloud Foundry:

* Local storage in each container instance is ephemeral. Every container launch will start with unmodified image.
* Traffic will be routed to the lowest exposed port (by `EXPOSE` command in Dockerfile). The PORT environment variable will be also set to this number.
* Buildpack based apps use bash to execute the app start command (`bash -c <command>`), but Docker image based apps use sh (`sh -c <command>`) - as bash presence cannot be assumed in your Docker image.
* Privileged container mode is not supported. Features depending on this will not work.
* Only registries that use Docker Registry API V2 are supported.

Your responsibilities change if you use a Docker image instead of a buildpack. Refer to the [responsibility model guidance](/guidance.html#responsibility-model) for further information.

### Docker Registry Availability Requirements

Deploying, scaling, restarting or restaging an app using a Docker image are all dependent on the Docker registry being available, because these actions require pulling the image from the registry.

Note that Cloud Foundry can restart your application due to circumstances outside of your direct control, such as platform scaling or deployments, or failure of the underlying hardware platform.

If Cloud Foundry attempts to pull the image from the registry when the registry is not available, your application instance will fail to start, and you will receive a `Failed to create container` message. Once the Docker registry is available again, you will be able to re-deploy, restart or restage your app as required.

### Applying security updates

When your app is built with a standard buildpack, you are responsible only for the code of your app. The platform provides both the buildpacks and also a safe and secure root filesystem (`cflinuxfs3`). Buildpack based apps never have root access in their container, which adds another layer of security. We do periodically apply security and functionality updates to the buildpacks, container root FS and the platform itself.

When your app is deployed from Docker image, responsibility for the root filesystem and for the complete build of your app shifts to you. You need to ensure proper measures are applied to make your app and root image safe and with the latest security updates. We recommend you use one of the major and well supported linux distributions as your base container. This way you will be able to build an image with latest security patches easily.
