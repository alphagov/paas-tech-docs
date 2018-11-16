# Deploying apps

## Deploying public apps

By default, all apps you deploy on Cloud Foundry are publicly accessible.

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

1. Deploy your app by running the following in the directory which contains your app's code, configuration files, and manifest:

    ```
    cf push
    ```

Your app should now be live at your [app domain](/orgs_spaces_users.html#regions).

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


## Deploying private apps

You can deploy your apps such that they are not publicly accessible from the internet.

A common use case is that you have two apps to deploy:

- a public app for your users to interact with
- a private app that the public app needs to connect to without the private app being accessible from the internet

To achieve this, you must:

- specify the private route in the private app's manifest
- set the private app URL as an [environment variable](/deploying_apps.html#environment-variables) in the public app's manifest
- create a network policy to allow the apps to connect with each other

If you need to restrict access to a public app, you should refer to the documentation on [route services](/deploying_services/route_services/#route-services).

### Specify a private route in the private app's manifest

A [route](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#routes) [external link] is an address associated with a Cloud Foundry app. Cloud Foundry uses routes to send requests to apps.

You must specify a private route in the private app's manifest to tell Cloud Foundry that this app should not be accessible from the internet.

Create the private app's manifest with the following code:

```
---
applications:
- name: PRIVATE_APPNAME
  routes:
  - route: PRIVATE_APPNAME.apps.internal
```

If the private app was previously a public app, you must also run the following to remove the pre-existing public route:

```
cf unmap-route PRIVATE_APPNAME DOMAIN --hostname HOSTNAME
```

### Set the private app URL in the public app's manifest

The public app must read the private app URL from an environment variable in the public app's manifest.

<br>

<style>
.govuk-warning-text{font-family:nta,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-weight:400;font-size:16px;font-size:1rem;line-height:1.25;color:#0b0c0c;position:relative;margin-bottom:20px;padding:10px 0}@media print{.govuk-warning-text{font-family:sans-serif}}@media (min-width:40.0625em){.govuk-warning-text{font-size:19px;font-size:1.1875rem;line-height:1.31579}}@media print{.govuk-warning-text{font-size:14pt;line-height:1.15;color:#000}}@media (min-width:40.0625em){.govuk-warning-text{margin-bottom:30px}}.govuk-warning-text__assistive{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;-webkit-clip-path:inset(50%)!important;clip-path:inset(50%)!important;border:0!important;white-space:nowrap!important}.govuk-warning-text__icon{font-family:nta,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-weight:700;display:inline-block;position:absolute;top:50%;left:0;min-width:32px;min-height:29px;margin-top:-20px;padding-top:3px;border:3px solid #0b0c0c;border-radius:50%;color:#fff;background:#0b0c0c;font-size:1.6em;line-height:29px;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}@media print{.govuk-warning-text__icon{font-family:sans-serif}}.govuk-warning-text__text{display:block;margin-left:-15px;padding-left:65px}
</style>

<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-warning-text__assistive">Warning</span>
    <p>Connections between public and private apps are not encrypted by default.</p>
    <p>If you need encrypted connections between your apps, it is your responsibility to implement this.</p>
  </strong>
</div>

You must specify:

- the private app URL as a non-secure `http` URL
- `apps.internal` as the domain
- port 8080 in the URL

To do this, create the public app's manifest with the following code:

```
---
applications:
- name: PUBLIC_APPNAME
  env:
    ENVIRONMENT_VARIABLE_NAME: http://PRIVATE_APPNAME.apps.internal:8080
```

where:

- `PUBLIC_APPNAME` is the name of your public app
- `ENVIRONMENT_VARIABLE_NAME` is the [environment variable](#environment-variables) your public app reads (for example `PRIVATE_APP_URL`)
- `PRIVATE_APPNAME` is the name of your private app

### Create a network policy

By default, Cloud Foundry apps do not accept internal connections from other apps.

You must create a [network policy](http://cli.cloudfoundry.org/en-US/cf/add-network-policy.html) [external link] to allow the public app to connect to the private app.

1. [Push](/deploying_apps.html#deploying-public-apps) both the public and private apps.
1. Run the following in the command line to create the network policy:

```
cf add-network-policy PUBLIC_APPNAME --destination-app PRIVATE_APPNAME --protocol tcp --port 8080
```

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you have any further questions.

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
