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

1. Deploy your app by running `cf push` in the directory which contains your app's code, configuration files, and manifest.

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

- specify the internal route in the private app's manifest
- set the private app URL as an environment variable in the public app's manifest
- create a network policy for both apps

The two apps must be in the same [space](/orgs_spaces_users.html#spaces) to be able to connect to each other.

### Specify the internal route in the private app's manifest

A [route](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#routes) [external link] is an address associated with a Cloud Foundry app. Cloud Foundry uses routes to send requests to apps.

You must specify an internal route in the private app's manifest to tell Cloud Foundry that this app should not be accessible from the internet.

Create the private app's manifest with the following code:

```
---
applications:
- name: PRIVATE_APPNAME
  routes:
  - route: PRIVATE_APPNAME.apps.internal
```

### Set the private app URL in the public app's manifest

The public app must read the private app URL from an environment variable in the public app's manifest.

Private routes use HTTP by default (see [security](#security)) on port 8080. You must specify the port explicitly in the URL (e.g. `http://PRIVATE_APPNAME.apps.internal:8080`).

Create the public app's manifest with the following code:

```
---
applications:
- name: PUBLIC_APPNAME
  env:
    PRIVATE_APP_URL: http://PRIVATE_APPNAME.apps.internal:8080
```

### Create a network policy for both apps

By default, Cloud Foundry apps do not accept internal connections from other apps.

You must create a [network policy](https://docs.cloudfoundry.org/devguide/deploy-apps/cf-networking.html#create-policies) [external link] to allow the public app to connect to the private app. 

1. [Push](/deploying_apps.html#deploying-public-apps) both the public and private apps.

1. Run the following in the command line to create the network policy:

```
cf add-network-policy PUBLIC_APPNAME --destination-app PRIVATE_APPNAME --protocol tcp --port 8080
```

### Security

Connections between public and private apps are not encrypted by default. For example, the `PRIVATE_APP_URL` environment variable is a non-secure `http` URL.

If you need encrypted connections between your apps, it is your responsibility to implement this.

### Further information

For more information, refer to:

_further information links?_

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
