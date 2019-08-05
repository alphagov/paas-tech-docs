## Buildpacks

### About buildpacks

Cloud Foundry uses buildpacks to provide runtime and framework support for applications in different languages (for example ensuring your app code has both the Ruby runtime and the  Rails framework available to help it run). GOV.UK PaaS supports both standard and custom buildpacks:

- [standard buildpacks](https://docs.cloudfoundry.org/buildpacks/#system-buildpacks) are buildpacks for common languages and frameworks that are supported by Cloud Foundry. You can check the installed buildpacks and their versions by running `cf buildpacks`.
- custom buildpacks are developed by the wider community to enable hosting of applications in additional languages or frameworks
- Docker images are a packaging format, and the requirements for the app and its runtime environment are the same as for apps deployed using buildpacks

### Which buildpack should I use?

We recommend using the standard buildpacks to maximise the support you will receive from GOV.UK PaaS. Using a custom buildpack or Docker image will mean additional setup and maintenance costs.

Your responsibilities change depending on whether you use a standard buildpack, custom buildpack or a Docker image. Refer to the [documentation on knowing your responsibilities](responsibility_model.html#know-your-responsibilities) for further information.

### Buildpack language version updates

You should tell Cloud Foundry which version of your app's language to use in the buildpack. You can specify an exact, minor or major version of the language. For example, with Python:

<div style="height:1px;font-size:1px;">&nbsp;</div>

|Category|Python Example|
|:---|:---|
|Exact|`3.5.2`|
|Minor|`3.5.x`|
|Major|`3.x`|

<div style="height:1px;font-size:1px;">&nbsp;</div>

If you specify an exact version, you must update this version when the GOV.UK PaaS team update the language's buildpack. Your app will fail to start if the language version it relies on is not supported by the latest language buildpack.

If you specify a major or a minor version, your app will automatically upgrade to use a more recent version of its language when the GOV.UK PaaS team updates the buildpack. The major or minor version must still be live for this upgrade to work. However, if there is a breaking change between language versions, your app may not behave as expected or even fail.

You should always check the GOV.UK PaaS announcements email for information on which language versions are in the latest language buildpacks.

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
