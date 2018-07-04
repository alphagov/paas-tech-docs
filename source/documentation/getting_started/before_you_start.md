
# Before you start

Before it can start using the platform, your department, agency or team must accept the Terms of Use during account activation.

To be hosted on GOV.UK PaaS, your app must:

- follow the [twelve-factor application principles](/#12-factor-application-principles); this will be true if your app has been written so it can deploy to another PaaS like Heroku
- [store data classified up to ‘official’](/#data-security-classification); your app cannot store data classified as 'secret' or 'top secret'
- be built using a [supported buildpack](/#buildpacks) or written in one of these languages:
    - Go
    - Nodejs
    - Java
    - PHP
    - Python
    - Ruby
    - static HTML/CSS/Javascript site

    >The [.NET Core buildpack](https://docs.cloudfoundry.org/buildpacks/dotnet-core/index.html) [external link] is only available as a custom buildpack.

[Cloud Foundry buildpacks](/#buildpacks) provide runtime and framework support for your application. For most languages, you will need to provide configuration files to describe your app’s dependencies. Most buildpacks will support a limited range of versions of the language.
