# Deploying apps

## Deployment overview

The `cf push` command is used both to create a new app and to push a new version of an existing one. The basic steps:

1. Put the code you want to deploy in a directory. This is usually accomplished by checking it out of version control.

1. [Target](deploying_apps.html#set-a-target) the appropriate organisation and space.

    ```
    cf target -o SOMEORG -s SOMESPACE
    ```

1. Deploy the application by running:

    ```
    cf push APPNAME
    ```

    from the directory which contains the code and configuration files for your app.

The app should now be live at `https://APPNAME.cloudapps.digital`.

There are many options available when you ``push`` an app. You can optionally set them in a ``manifest.yml`` file in the directory from which you are running the ``push`` command. See the Cloud Foundry documentation on [Deploying with Application Manifests](http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html) [external link] for details.

For a production app, you should read the [production checklist](deploying_apps.html#production-checklist).

### Set a target

To deploy an app, you need to set a target. A target is a combination of an org and a space.

Run the following to set the target:

```
cf target -o ORGNAME -s SPACENAME
```

where `ORGNAME` is the name of the org, and `SPACENAME` is the name of the space.

Once you set the target, the Cloud Foundry client remembers it until you change it.

You can change space without changing org using:

```
cf target -s SPACENAME
```

You should target the sandbox space while you are testing your app. You can do this by running:

```
cf target -s sandbox
```

You will not normally need to target the sandbox space if you are a new user, as this space is the default for new users.

A possible exception to this is if your org is mature and has pre-existing spaces; you should check to ensure that you target the appropriate space for testing.

### Caveats
* Your app should not write to local storage. Cloud Foundry local storage is ephemeral and can be deleted at any time.
* You may need to set environment variables for your app to work. All configuration information should be stored in environment variables, not in the code.
* Instances will be restarted if they [exceed memory limits](managing_apps.html#quotas).
* Your application should write all its log messages to `STDOUT`/`STDERR`, rather than a log file.

## Data security classification

You can store data classified up to ‘official’ on the GOV.UK PaaS.

You cannot store data classified ‘secret‘ or ‘top secret‘ on the GOV.UK PaaS.

Refer to the [information assurance page](https://www.cloud.service.gov.uk/ia) for information on the assurance process.

Refer to the [GOV.UK page on government security classifications](https://www.gov.uk/government/publications/government-security-classifications) for more information on these classifications.

## Secure and non-secure requests

Requests could be made to the non-secure `http://` protocol due to:

 * misconfiguration of an app that allows non-encrypted traffic through
 * a service linking to the HTTP version of a page by mistake

In this situation, any requests made to the `http://` protocol will be automatically redirected to the base HTTPS version of that URL. The original query path and query parameters will be removed. This prevents a site from repeatedly redirecting back to the HTTP protocol without the user noticing.
