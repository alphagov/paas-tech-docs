## Deploy a .NET Core app

This section covers how to deploy a .NET Core application to GOV.UK PaaS using the [dotnet-core buildpack](https://github.com/cloudfoundry/dotnet-core-buildpack).

### Deploying an ASP.NET Core Web App

This example will walk through creating a simple "Hello World" web application using [the `dotnet` command line interface](https://docs.microsoft.com/en-us/dotnet/core/tools/).
The instructions assume you have already carried out the setup process explained in the [Get started](/get_started.html#get-started) section.

1. Install the dotnet core command line interface (CLI) tools

    See Microsoft's [documentation for instructions on how to do this](https://docs.microsoft.com/en-us/dotnet/core/tools/#installation).

1. Create a new ASP.NET Core Web App using the dotnet CLI

    ```bash
    dotnet new webapp --name your-app-name
    ```

1. Change directory into your new application's directory

    ```bash
    cd your-app-name
    ```

1. Create a manifest to describe how your application should be deployed

    ```yaml
    ---
    applications:
    - name: your-app-name
      buildpacks:
      - dotnet_core_buildpack
      memory: 256M
    ```

1. Pick a version of the .NET framework to target which is supported by the current buildpack

    1. Run `cf buildpacks` and look at the filename for `dotnet_core_buildpack` to work out the version (for example, if the filename was `dotnet-core-buildpack-cflinuxfs3-v2.3.2.zip` the version of the buildpack would be `v2.3.2`).

    1. Visit the buildpack's releases page, for example [https://github.com/cloudfoundry/dotnet-core-buildpack/releases/tag/v2.3.2](https://github.com/cloudfoundry/dotnet-core-buildpack/releases/tag/v2.3.2)
    
    1. Check the versions of `dotnet-sdk` supported by the buildpack - you should usually use the latest supported version, for example 3.0.100

    1. Edit your `.csproj` file and change the contents of the `<TargetFramework>` element to the target framework corresponding to the supported framework version (for example, use `netcoreapp3.0` for a 3.0.x version of `dotnet-sdk`). See [Microsoft's documentation on supported target framework versions](https://docs.microsoft.com/en-us/dotnet/standard/frameworks#supported-target-framework-versions).

    1. Create a `buildpack.yml` file to specify which version of the framework the buildpack should use:

        ```yaml
        ---
        dotnet-core:
          sdk: 3.x
        ```

1. Push your application to GOV.UK PaaS

    ```bash
    cf push
    ```

You have now deployed your .NET core application. Your application should now be accessible over HTTPS from the URL provided in the output.
