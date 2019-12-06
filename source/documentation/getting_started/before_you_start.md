
# Before you start

Before it can start using the platform, your department, agency or team must accept the Terms of Use during account activation.

To be hosted on GOV.UK PaaS, your app must:

- follow the [twelve-factor application principles](architecture.html#12-factor-application-principles); this will be true if your app has been written so it can deploy to another PaaS like Heroku
- [store data classified up to ‘official’](deploying_apps.html#data-security-classification); your app cannot store data classified as 'secret' or 'top secret'

[Cloud Foundry buildpacks](deploying_apps.html#buildpacks) provide runtime and framework support for your application. For most languages, you will need to provide configuration files to describe your app’s dependencies. Most buildpacks will support a limited range of versions of the language.
