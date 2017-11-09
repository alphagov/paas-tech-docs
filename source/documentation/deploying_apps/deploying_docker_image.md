## Deploy a Docker image (experimental)

This section explains how to deploy an app from a Docker image. The role of the Docker image is to serve as a packaging format and the requirements for the app and its runtime environment are the same as for apps deployed using buildpacks. Configuration via manifest.yml also stays the same, albeit you should not specify buildpack. If you do, it will be ignored, which can create some confusion to anyone reading the manifest. Our platform currently supports deploying from the following:

* Docker Hub
* [Docker Trusted Registry](https://docs.docker.com/datacenter/dtr/2.1/guides/) [external page] servers
* Docker registries that require authentication

Pushing local Docker images isn't supported.

To deploy an app using a Docker image stored in Docker Hub via CF cli:

``cf push myapp --docker-image dockerhuborg/app_image:tag``

To deploy an app using a Docker image stored in Docker Trusted Registry (DTR) via CF cli:

``cf push myapp --docker-image MY-PRIVATE-REGISTRY.DOMAIN:5000/image/name:tag``

To deploy an app using a Docker image stored in a registry that requires authentication, follow the [Cloud Foundry Docker image documentation instructions](https://docs.cloudfoundry.org/devguide/deploy-apps/push-docker.html#private-repo) [external link].

You might notice that the staging process is simplified when deploying from a Docker image - this is because there is no need to build the app from the pushed code using a buildpack. Also, the buildpack for apps deployed from a Docker image will be reported as `unknown` in the app information (``cf app <myapp>``).

There are a few more specifics about Docker image support in Cloud Foundry:

* Local storage in each container instance is ephemeral. Every container launch will start with unmodified image.
* Traffic will be routed to the lowest exposed port (by `EXPOSE` command in Dockerfile). The PORT environment variable will be also set to this number.
* Buildpack based apps use bash to execute the app start command (`bash -c <command>`), but Docker image based apps use sh (`sh -c <command>`) - as bash presence cannot be assumed in your Docker image.
* Privileged container mode is not supported. Features depending on this will not work.
* Only registries that use Docker Registry API V2 are supported.

### Experimental feature

Please note that this is currently only an experimental feature, meaning you can potentially encounter some unexpected behaviour or glitches. It is also possible that we might turn the feature off in the future. It should not be used in live services at this stage.

Lastly, our support for this functionality has lower priority than usual requests, so it is possible that responses to your queries regarding this will take a bit longer. However we are turning on this feature in order get feedback from service teams, so please contact support with any comments or to talk about use in production systems.

### Applying security updates

When your app is built with a standard buildpack, you are responsible only for the code of your app. The platform provides both the buildpacks and also a safe and secure root filesystem (`cflinuxfs2`). Buildpack based apps never have root access in their container, which adds another layer of security. We do periodically apply security and funcionality updates to the buildpacks, container root FS and the platform itself.

When your app is deployed from Docker image, responsibility for the root filesystem and for the complete build of your app shifts to you. You need to ensure proper measures are applied to make your app and root image safe and with the latest security updates. We recommend you use one of the major and well supported linux distributions as your base container. This way you will be able to build an image with latest security patches easily.
