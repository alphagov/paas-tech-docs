## Buildpacks

### About buildpacks

Cloud Foundry uses buildpacks to provide runtime and framework support for applications in different languages (for example ensuring your app code has both the Ruby runtime and the  Rails framework available to help it run). GOV.UK PaaS supports both standard and custom buildpacks:

- [standard buildpacks](https://docs.cloudfoundry.org/buildpacks/#system-buildpacks) [external link] are buildpacks for common languages and frameworks that are supported by Cloud Foundry. You can check the installed buildpacks and their versions by running `cf buildpacks`.
- custom buildpacks are developed by the wider community to enable hosting of applications in additional languages or frameworks
- Docker images are a packaging format, and the requirements for the app and its runtime environment are the same as for apps deployed using buildpacks

### Which buildpack should I use?

We recommend using the standard buildpacks to maximise the support you will receive from GOV.UK PaaS. Using a custom buildpack or Docker image will mean additional setup and maintenance costs.

Refer to the [Guidance](https://docs.cloud.service.gov.uk/#guidance-buildpacks) section for further information on the different options available.

### How to use custom buildpacks

There are many application attribute options available when you push an app. You can use the buildpack attribute to specify a custom buildpack for your app through:

- specifying the buildpack in the manifest.yml file
- using the command line

#### Specifying buildpacks in the manifest file

You can set application attribute options in a manifest.yml file in the directory from which you are running the push command. This is done in one of three ways:

1. By name: MY-BUILDPACK.
2. By GitHub URL: https://github.com/cloudfoundry/java-buildpack.git.
3. By GitHub URL with a branch or tag: https://github.com/cloudfoundry/java-buildpack.git#v3.3.0 for the v3.3.0 tag.

```
---
  ...
  buildpack: buildpack_URL
```

>Command line options override the manifest; the option that overrides the custom buildpack attribute is `-b`.

#### Using the command line to choose buildpacks

Once a custom buildpack has been created, it can be pushed to either a public or private git repository. The repository URL can then be included in the command line to push your app.

>If the repository is private, the push command must include https and username/password authentication

- Public: `$ cf push my-new-app -b git://github.com/johndoe/my-buildpack.git`
- Private: `$ cf push my-new-app -b https://username:password@github.com/johndoe/my-buildpack.git`

The app will then be deployed to Cloud Foundry, and the buildpack will be cloned from the repository and applied to the app.

>If a buildpack is specified using `cf push -b` the detect step will be skipped and as a result, no buildpack detect scripts will be run.
