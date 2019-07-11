# Guidance

## Responsibility model

You are responsible for keeping your application secure. The GOV.UK PaaS team
are responsible for keeping the infrastructure your application runs on secure,
and for providing secure application runtimes.

Depending on how you deploy your application you may be able to take
advantage of security patches provided by GOV.UK PaaS.

### Standard buildpacks

GOV.UK PaaS provides a set of [standard buildpacks](/deploying_apps.html#buildpacks).

If you use a standard buildpack then security patches for the build
environment, language runtime, base operating system libraries and linux
kernel are provided for you by GOV.UK PaaS.

You are responsible for ensuring that your application works with new
buildpack versions and for redeploying your application so that it uses the
latest version of the standard buildpack.

If you're relatively new to cloud or have a small development team, we
recommend using the standard buildpacks to maximise the support you will
receive from GOV.UK PaaS.

### Custom buildpacks

If the standard buildpacks don't work for your application (for example if
you want to use a language GOV.UK PaaS doesn't support) you can use a 
[custom buildpack](/deploying_apps.html#how-to-use-custom-buildpacks).

If you use a custom buildpack then you are responsible for its security,
which includes your application's build environment and language runtime.

Security patches for the base operating system libraries and the linux kernel
are provided for you by GOV.UK PaaS.

You are responsible for ensuring that your application works
with new operating system versions, and for redeploying you application so
that it uses the latest operating system libraries.

### Docker images

If you prefer, you can use a [docker image](/deploying_apps.html#deploy-a-docker-image)
instead of a buildpack.

If you use a docker image then you are responsible for its security, which
includes your application's build environment, language runtime and operating
system.

Security patches for the linux kernel are provided for you by GOV.UK PaaS.

### Custom buildpacks compared to Docker images

Custom buildpacks provide some advantages over choosing a Docker solution:

- they provide a standard way of building and staging apps
- they are not dependent on a Docker registry such as [Docker Hub](https://hub.docker.com/) being available
- there is a large variety of open source buildpacks, meaning your deployment pipeline doesn’t need to include Docker image creation
- buildpacks are designed for 12-factor apps; some Docker images may contain databases or other forms of storage that should be provisioned as an external backing service

Docker images also provide some advantages over custom buildpacks:

- the same image can be run locally on developer machines, or on any Linux-based machine
- exactly the same Docker image can be promoted between environments as an immutable asset, rather than being rebuilt each time
