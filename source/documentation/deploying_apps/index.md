# Deploying apps

## Deployment overview

The `cf push` command can both create a new app and push a new version of an existing app.

1. Put your app's code and configuration files in a local directory.

1. [Target](deploying_apps.html#set-a-target) the appropriate organisation and space by running:

    ```
    cf target -o ORG_NAME -s SPACE_NAME
    ```
    
    where `ORG_NAME` is the name of the org, and `SPACE_NAME` is the name of the space.

1. Create a `manifest.yml` file in the same local directory as your app's code. The manifest file tells Cloud Foundry what to do with your app. An example manifest:

    ```
    ---
    applications:
    - name: APP_NAME
    ```

    where `APP_NAME` is the unique name for your app. You can run `cf apps` to see apps which already exist.

1. Deploy your app by running `cf push` in the directory which contains your app's code, configuration files, and manifest.

Your app should now be live at `https://APP_NAME.cloudapps.digital`.

Refer to the Cloud Foundry documentation on [Deploying with Application Manifests](http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html) [external link] for more information on the options available when you deploy an app.

Refer to the [production checklist](deploying_apps.html#production-checklist) if your app is a production app.

### Set a target

To deploy an app, you need to set a target. A target is a combination of an org and a space.

Run the following to set the target:

```
cf target -o ORG_NAME -s SPACE_NAME
```

where `ORG_NAME` is the name of the org, and `SPACE_NAME` is the name of the space.

The Cloud Foundry client remembers the target until you change it.

You can change space without changing org by running:

```
cf target -s SPACE_NAME
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
