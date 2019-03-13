# Managing custom domains using the cdn-route service

This section explains how to manage custom domains for your app with a content distribution network (CDN). The CDN:

- routes requests to your app
- [caches](#caching) responses

You can use the GOV.UK PaaS cdn-route service to set up the CDN.

With the CDN in place, your app will be available on a domain of your choice through HTTPS. The GOV.UK PaaS redirects non-secure HTTP requests to a secure version of your app.

You must configure the cdn-route service to use a subdomain. If you configure the service to use an apex domain, the service creation might not succeed. The following table contains examples of apex domains and subdomains:

<div style="height:1px;font-size:1px;">&nbsp;</div>

|Apex domain|Subdomain|
|:---|:---|
|`example.com`|`www.example.com`|
|`example.service.gov.uk`|`www.example.service.gov.uk`|

<div style="height:1px;font-size:1px;">&nbsp;</div>

Once you create a CDN service instance, you cannot update or delete the instance until you have completed the setup process. If you make a mistake that breaks the configuration, email GOV.UK PaaS support at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to delete the service instance.

## Set up the service

### Set up a cdn-route service with one or more custom domains

1. Target the space your app is running in:

    ```
    cf target -o ORG_NAME -s SPACE_NAME
    ```

    where:
    - `ORG_NAME` is the name of your org
    - `SPACE_NAME` is the name of your space

1. Create the required domain(s) in your organisation. Run the following for each domain:

    ```
    cf create-domain ORG_NAME DOMAIN_NAME
    ```

1. Create an instance of the cdn-route service:

    ```
    cf create-service cdn-route cdn-route SERVICE_INSTANCE
    -c '{"domain": "SUBDOMAIN_LIST"}'
    ```

    where:
    - `SERVICE_INSTANCE` is your chosen name for your service instance
    - `SUBDOMAIN_LIST` is a comma-separated list of your subdomain(s), for example `www.example.com,www.example.net` (do not include a comma after the final subdomain)

    This command includes `cdn-route` twice because cdn-route is the name of the service and the name of the service plan.

1. Get the DNS information required to configure your subdomain:

    ```
    cf service SERVICE_INSTANCE
    ```

    Example output:

    ```
    Last Operation
    Status: create in progress
    Message: Provisioning in progress
             [www.example.com,www.example.net => london.cloudapps.digital];
             CNAME or ALIAS domain www.example.com,www.example.net to
             d3nrs0916m1mk2.cloudfront.net and create TXT record(s):
    name: _acme-challenge.www.example.com.,
          value: ngd2suc9gwUnH3btm7N6hSU7sBbNp-qYtSPYyny325E, ttl: 120
    name: _acme-challenge.www.example.net.,
          value: 4W9jHJIhnfDnWBBAENph6Qr8aeoSV7FzDiEDL-s-o4Q, ttl: 120
    ```

1. Create TXT records using the DNS information. These records validate your subdomain and allow the GOV.UK PaaS team to issue the TLS certificate used to encrypt traffic.

    In the example, you would create 2 `TXT` records for your subdomains:

    ```
    - _acme-challenge.www.example.com with a value of ngd2suc9gwUnH3btm7N6hSU7sBbNp-qYtSPYyny325E
    - _acme-challenge.www.example.net with a value of 4W9jHJIhnfDnWBBAENph6Qr8aeoSV7FzDiEDL-s-o4Qs
    ```

1. Create one CNAME record for each subdomain using the DNS information. This directs traffic to your service.

    You should not create CNAME records until your cdn-route service instance has been created. Run `cf service SERVICE_INSTANCE` to check the status of your service instance. If the service has been created, the service status will say `Create succeeded`.

    In the example, you would create 2 `CNAME` records in your DNS server for `www.example.com` and `www.example.net`. Each `CNAME` record would point the associated subdomain to `d3nrs0916m1mk2.cloudfront.net`.

    <style>
    .govuk-warning-text{font-family:nta,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-weight:400;font-size:16px;font-size:1rem;line-height:1.25;color:#0b0c0c;position:relative;margin-bottom:20px;padding:10px 0}@media print{.govuk-warning-text{font-family:sans-serif}}@media (min-width:40.0625em){.govuk-warning-text{font-size:19px;font-size:1.1875rem;line-height:1.31579}}@media print{.govuk-warning-text{font-size:14pt;line-height:1.15;color:#000}}@media (min-width:40.0625em){.govuk-warning-text{margin-bottom:30px}}.govuk-warning-text__assistive{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;-webkit-clip-path:inset(50%)!important;clip-path:inset(50%)!important;border:0!important;white-space:nowrap!important}.govuk-warning-text__icon{font-family:nta,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-weight:700;display:inline-block;position:absolute;top:50%;left:0;min-width:32px;min-height:29px;margin-top:-20px;padding-top:3px;border:3px solid #0b0c0c;border-radius:50%;color:#fff;background:#0b0c0c;font-size:1.6em;line-height:29px;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}@media print{.govuk-warning-text__icon{font-family:sans-serif}}.govuk-warning-text__text{display:block;margin-left:-15px;padding-left:65px}
    </style>

    <div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        <p>These instructions assume that you are using the GOV.UK PaaS to launch a new service and your subdomains are not already delivering a service.</p>
        <p>If this is not the case and you are migrating an existing service, your technical operations team should refer to this documentation when the team are designing a custom migration process for your service.</p>
      </strong>
    </div>

You have now set up the custom domain. Next, you should [map a subdomain to your app](#map-a-subdomain-route-to-your-app).

It should take one hour for domain setup to finish after you have created the required DNS records. If the process is still incomplete after 2 hours, please refer to the [troubleshooting](/deploying_services/use_a_custom_domain/#troubleshooting-custom-domains) section.

If you have set up a custom domain using the cdn-route service and you want to stop using this custom domain with the GOV.UK PaaS, you must [remove the custom domain from your cdn-route service](#remove-a-custom-domain-from-your-cdn-route-service).

You can associate up to 100 subdomains with a single cdn-route service instance.

## Amend the service

### Add a custom domain to your existing cdn-route service

1. Check which custom domains your existing cdn-route service has:

    ```
    cf service SERVICE_INSTANCE | grep ^message:
    ```

    where `SERVICE_INSTANCE` is the name of one of your existing cdn-route service instances.

    Example output:

    ```
    message: Service instance provisioned [www.example.com,www.example.net =>
             london.cloudapps.digital]; CDN domain d3nrs0916m1mk2.cloudfront.net
    ```

    In the example, there are 2 custom domains: `www.example.com` and `www.example.net`.

1. Update your service with the expanded list of custom domains:

    ```
    cf update-service SERVICE_INSTANCE \
    -c '{"domain": "EXPANDED_SUBDOMAIN_LIST"}'
    ```


	where `EXPANDED_SUBDOMAIN_LIST` is the comma-separated list of subdomains.

    For example, your cdn-route service is named `custom-domains-production` and has 2 custom domains, `www.example.com` and `www.example.net`.  Run the following to add `www.example.org` to the list of custom domains:

    ```
    cf update-service custom-domains-production \
      -c '{"domain": "www.example.com,www.example.net,www.example.org"}'
    ```

    If you have previously customised the [cookies](#disabling-forwarding-cookies) or the [headers](#forwarding-headers) forwarded by your cdn-route service, you must include those as configuration parameters in the `cf update-service` command. For example:

    ```
    cf update-service custom-domains-production \
      -c '{"domain": "www.example.com,www.example.net,www.example.org",
           "cookies": false, "headers": ["Accept", "Authorization"]}'
    ```

1. Get the DNS information required to configure your subdomain:

    ```
    cf service SERVICE_INSTANCE
    ```

    Example output:

    ```
    Last Operation
    Status: update in progress
    Message: Update in progress
             [www.example.com,www.example.net,www.example.org => london.cloudapps.digital];
             CNAME or ALIAS domain www.example.com,www.example.net,www.example.org to
             d3nrs0916m1mk2.cloudfront.net and create TXT record(s):
    name: _acme-challenge.www.example.com.,
          value: ngd2suc9gwUnH3btm7N6hSU7sBbNp-qYtSPYyny325E, ttl: 120
    name: _acme-challenge.www.example.net.,
          value: 4W9jHJIhnfDnWBBAENph6Qr8aeoSV7FzDiEDL-s-o4Q, ttl: 120
    name: _acme-challenge.www.example.org.,
          value: 534fgHjJIfnfDnIHKAENph6GVU8aeoSV7FzDEDL-s4H, ttl: 120
    ```

1. Create TXT records using the DNS information. These records validate your subdomain and allow the GOV.UK PaaS team to issue the TLS certificate used to encrypt traffic.

    In the example, you would create a single `TXT` record for your new domain of `_acme-challenge.www.example.org.` with a value of `534fgHjJIfnfDnIHKAENph6GVU8aeoSV7FzDEDL-s4H`.

1. Create a CNAME record for the new subdomain using the DNS information. This directs traffic to your service.

    You should not create CNAME records until your cdn-route service instance has finished updating. Run `cf service SERVICE_INSTANCE` to check the status of your service instance. If the update has finished, the service status will say `Update succeeded`.

    In the example, you would create a `CNAME` record in your DNS server pointing `www.example.org` to `d3nrs0916m1mk2.cloudfront.net.`

You have now added a custom domain to your existing cdn-route service. Next, you should [map a subdomain to your app](#mapping-a-subdomain-route-to-your-app).

It should take one hour for domain setup to finish after you have created the required DNS records. If the process is still incomplete after 2 hours, please refer to the [troubleshooting](/deploying_services/use_a_custom_domain/#troubleshooting-custom-domains) section.

If you have set up a custom domain using the cdn-route service and you want to stop using this custom domain with the GOV.UK PaaS, you must [remove the custom domain from your cdn-route service](#removing-a-custom-domain-from-your-cdn-route-service).

You can associate up to 100 subdomains with a single cdn-route service instance.

### Map a subdomain route to your app

Read this section to make your apps accessible through subdomains.

For each subdomain, map the route to the app:

```
cf map-route APP_NAME --hostname www DOMAIN_NAME
```

where `DOMAIN_NAME` is the name of the domain.

Your app is now ready to receive requests through the subdomain.

### Remove a custom domain from your cdn-route service

<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-warning-text__assistive">Warning</span>
    <p>Removing the domain results in the service provided by the app on that domain becoming unavailable.</p>
  </strong>
</div>

1. Your org manager should check if any apps are using a custom domain before removing that domain:

    ```
    cf routes --orglevel | grep -we DOMAIN_NAME -e^space
    ```

    Example output:

    ```
    space   host     domain        port   path   type   apps     service
    tools   www      DOMAIN_NAME                        app-1
    tools   info     DOMAIN_NAME                        app-2
    ```
    In the example, your org manager must tell the owners of `app-1` and `app-2` that you are removing the domain:

1. Remove the custom domain from Cloud Foundry's routing database:

    ```
    cf delete-domain DOMAIN_NAME
    ```
    This also deletes the custom domain from every app using that domain.

1. Check how many custom domains your cdn-route service has:

    ```
    cf service SERVICE_INSTANCE | grep ^message:
    ```

    where `SERVICE_INSTANCE` is the name of one of your existing cdn-route service instances.

    Example output:

    ```
    message: Service instance provisioned [www.example.com,www.example.net =>
             london.cloudapps.digital]; CDN domain d3nrs0916m1mk2.cloudfront.net
    ```
    In the example, there are 2 custom domains: `www.example.com` and `www.example.net`.

    If you cannot see this output, please contact GOV.UK PaaS support at [gov-uk-paas-support@digital.cabinet-office.gov.uk.](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) before proceeding.

The next step depends on whether your cdn-route service has one or multiple associated custom domains.

#### One associated domain

If your cdn-route service only has one associated custom domain, you must delete the service and the associated custom domain:

```
cf delete-service SERVICE_INSTANCE
```

where `SERVICE_INSTANCE` is the name of the appropriate cdn-route service instance.

You have now deleted your custom domain from the GOV.UK PAaS. You should next [change or remove the domain’s DNS records](#changing-your-custom-domain-39-s-dns-records).

#### Multiple associated domains

If your cdn-route service has multiple associated custom domains, you must update your service with the reduced list of custom domains:

```
cf update-service SERVICE_INSTANCE \
-c '{"domain": "REDUCED_SUBDOMAIN_LIST"}'
```

For example, your cdn-route service is named `custom-domains-production` and has 3 custom domains, `www.example.com`, `www.example.net` and `www.example.org`.  Run the following to remove `www.example.com`:


```
cf update-service custom-domains-production \
    -c '{"domain": "www.example.net,www.example.org"}'
```

If you have previously customised the [cookies](#disabling-forwarding-cookies) or the [headers](#forwarding-headers) forwarded by your cdn-route service, you must include those as configuration parameters in the `cf update-service` command. For example:

```
cf update-service custom-domains-production \
  -c '{"domain": "www.example.net,www.example.org",
        "cookies": false, "headers": ["Accept", "Authorization"]}'
```

#### Changing your custom domain's DNS records

Once you have removed the custom domain(s) from your cdn-route service, you should delete any associated DNS records. This stops the removed domains' DNS records from pointing towards the GOV.UK PaaS. You should:

- delete or amend the subdomain's CNAME so that it does not point to the GOV.UK PaaS
- delete the subdomain's TXT record you created when you configured the subdomain to work with the GOV.UK PaaS

<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-warning-text__assistive">Warning</span>
      <p>Do not stop your domains' DNS records from pointing towards the GOV.UK PaaS before you have removed those custom domain(s) from your cdn-route service.</p>
      <p>If you do, all of your domains' TLS certificates will fail to renew without warning at some point over the next 90 days.</p>
      <p>Your users may not be able to use your service.</p>
  </strong>
</div>

## Configuring your custom domain

### Disabling forwarding cookies

By default cookies are forwarded to your app. You can disable this by setting the `cookies` parameter to `false`:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "www.example.com", "cookies": false}'
```
See the [More about how the CDN works](/deploying_services/use_a_custom_domain/#more-about-how-custom-domains-work) section for details.

### Forwarding headers

By default, our service broker configures the CDN to only forward the `Host` header to your app. You can whitelist extra headers; in this example you can whitelist the `Accept` and `Authorization` headers:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "www.example.com", "headers": ["Accept", "Authorization"]}'
```

You can supply up to nine headers. If you need to allow more headers you will have to forward all headers:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "www.example.com", "headers": ["*"]}'
```

Note that forwarding headers has a negative impact on cacheability. See the [More about how the CDN works](/deploying_services/use_a_custom_domain/#more-about-how-custom-domains-work) section for details.

### Troubleshooting custom domains

#### Service creation timescales

Service creation usually takes approximately one hour. Whilst a service is being created, you will see the status "create in progress" reported from commands like `cf service`. If it has not finished after 2 hours, we recommend that you check your DNS setup to make sure you completed the CNAME record creation correctly (see step seven). If this does not solve the issue, you may need to [contact support](https://www.cloud.service.gov.uk/support).

#### CloudFront timescales for serving your origin from all locations

It may take some time for CloudFront to serve your origin from all locations, because it is a globally distributed network. You can check in advance by sending requests to CloudFront and passing the custom domain in the `Host` header, using the example below. The CloudFront domain can be found by running `cf service my-cdn-route`.

```
curl -H "Host: <Custom domain>" https://<CloudFront domain>/
```

When this is working consistently, you can flip your DNS record to start serving content from the CDN. You may still have to wait for up to an hour to make sure the CloudFront distribution is updated everywhere.

#### "An operation for service instance [name] is in progress"

You may get the following error message when you try to update or delete a service instance:

```
Server error, status code: 409, error code: 60016, message: An operation for service instance [name] is in progress.
```

This happens because you can't do anything to a service instance while it's in a pending state. A CDN service instance stays pending until it detects the CNAME or ALIAS record. If this causes a problem for you, [contact support](https://www.cloud.service.gov.uk/support) to ask us to manually delete the pending instance.

## How custom domains work

### Overview

Custom domains are configured by our cdn-route service which uses a CloudFront distribution to proxy and/or cache requests to your app.

### Caching

CloudFront uses your app's `Cache-Control` or `Expires` HTTP headers to determine [how long to cache content](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) [external link]. If your app does not provide these headers, CloudFront will use a default timeout of 24 hours. This can be particularly confusing as different requests might be routed to different CloudFront Edge endpoints.

While there is no mechanism for GOV.UK PaaS users to trigger a cache clear, [GOV.UK PaaS support](https://www.cloud.service.gov.uk/support) can. Cache invalidation is not instantaneous; Amazon recommends expecting a lag time of 10-15 minutes (more if there are many distinct endpoints).

You can configure CloudFront to forward headers to your app, which causes CloudFront to cache multiple versions of an object based on the values in one or more request headers. See [CloudFront's documentation](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html#header-caching-web) [external link] for more detail. This means the more headers you forward the less caching will take place. Forwarding all headers means no caching will happen.

### Authentication

Cookie headers are forwarded to your app by default, so cookie-based authentication will work as expected. Other headers, such as HTTP auth, are stripped by default. If you need a different configuration, see the guidance on [Forwarding Headers](/deploying_services/use_a_custom_domain/#forwarding-headers).

### Further information

* The CloudFront documentation on headers can be found [here](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior) [external link]
* The CloudFront documentation on cookies can be found [here](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) [external link]
