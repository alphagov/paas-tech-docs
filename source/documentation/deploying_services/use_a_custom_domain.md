## Using a custom domain

This section explains how to configure a custom domain name for your application.

To use a custom domain with PaaS, you will need to use our `cdn-route` service to set up a Content Distribution Network (CDN) that will route and [optionally cache](#caching) requests to your app.

### Setting up a custom domain

>Before you begin, note that once you create a CDN service instance you can't update or delete it until it has been successfully configured. This means that if you make a mistake that prevents it from being successfully configured, you'll need to ask support to manually delete the service instance.

1. Target the space your application is running in:

    ```bash
    cf target -o ORGNAME -s SPACENAME
    ```

2. Create a domain in your organisation (replace `ORGNAME` with your org name, and replace `example.com` with your domain):

    ```bash
    cf create-domain ORGNAME example.com
    ```

3. Map the route to your application:

    ```bash
    cf map-route APPNAME example.com
    ```

4. Create an instance of the `cdn-route` service by running the following command, replacing `my-cdn-route` with the name of your service instance, and `example.com` with your domain:

    ```bash
    cf create-service cdn-route cdn-route my-cdn-route \
        -c '{"domain": "example.com"}'
    ```

    >This command includes `cdn-route` twice because `cdn-route` is the name of the service **and** the name of the service plan.


5. Get the DNS information required to configure your domain by running the following command, replacing `my-cdn-route` with the name of your service instance:

    ```bash
    cf service my-cdn-route
    ```
    This will output the DNS information, as per this example:

    ```
    Last Operation
    Status: create in progress
    Message: Provisioning in progress [example.com => origin-my-paas-app.cloudapps.digital]; CNAME or ALIAS domain example.com to d3nrs0916m1mk2.cloudfront.net or create TXT record(s):
    name: _acme-challenge.example.com., value: ngd2suc9gwUnH3btm7N6hSU7sBbNp-qYtSPYyny325E, ttl: 120

    ```

6. Create the TXT record using the DNS information output. This record will be used to validate your domain, and issue the TLS certificate used to encrypt traffic.

    Using this example, you will create a `TXT` record for your domain named `_acme-challenge.example.com.` with a value of `ngd2suc9gwUnH3btm7N6hSU7sBbNp-qYtSPYyny325E`.

7. Create the CNAME record using the DNS information output. This will direct traffic from your domain to the service.

    Using this example, you will create a `CNAME` record in your DNS server pointing `example.com` to `d3nrs0916m1mk2.cloudfront.net.`

You have now completed the custom domain setup process. Please note that it should take approximately one hour for domain setup to finish. If it has not finished after two hours, please refer to the [troubleshooting](#troubleshooting-custom-domains) section.

>Your application is only available over HTTPS.


### Configuring your custom domain

#### Multiple domains

If you have more than one domain, you can pass a comma-delimited list to the `domain` parameter. For example, to update your CDN instance to map both https://example.com and https://www.example.com you can run:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "example.com,www.example.com"}'
```

The maximum number of domains that can be associated with a single cdn-route service instance is 100.

#### Disabling forwarding cookies

By default cookies are forwarded to your application. You can disable this by setting the `cookies` parameter to `false`:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "example.com", "cookies": false}'
```
See the [More about how the CDN works](#more-about-how-custom-domains-work) section for details.

#### Forwarding headers

By default, our service broker configures the CDN to only forward the `Host` header to your application. You can whitelist extra headers; in this example you can whitelist the `Accept` and `Authorization` headers:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "example.com", "headers": ["Accept", "Authorization"]}'
```

You can supply up to nine headers. If you need to allow more headers you will have to forward all headers:

```bash
cf update-service my-cdn-route \
    -c '{"domain": "example.com", "headers": ["*"]}'
```

Note that forwarding headers has a negative impact on cacheability. See the [More about how the CDN works](#more-about-how-custom-domains-work) section for details.

### Removing your custom domain

If you no longer want to use your custom domain you can delete it by running the following command, replacing `my-cdn-route` with the name of your service instance:

```
cf delete-service my-cdn-route
```

You may have to wait for up to an hour for the changes to complete.

### Troubleshooting custom domains

#### Service creation timescales

Service creation usually takes approximately one hour. Whilst a service is being created, you will see the status "create in progress" reported from commands like `cf services`. If it has not finished after two hours, we recommend that you check your DNS setup to make sure you completed the CNAME record creation correctly (see step seven). If this does not solve the issue, you may need to [contact support](https://www.cloud.service.gov.uk/support).

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

### More about how custom domains work

#### Overview

Custom domains are configured by our cdn-route service which uses sets up CloudFront distributions to proxy and/or cache requests to your application.

#### Caching

CloudFront uses your application's `Cache-Control` or `Expires` HTTP headers to determine [how long to cache content](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html). If your application does not provide these headers, CloudFront will use a default timeout of **24 hours**. This can be particularly confusing as different requests might be routed to different CloudFront Edge endpoints.

While there is no mechanism for GOV.UK PaaS users to trigger a cache clear, [GOV.UK PaaS support](https://www.cloud.service.gov.uk/support) can. Cache invalidation is not instantaneous; Amazon recommends expecting a lag time of 10-15 minutes (more if there are many distinct endpoints).

You can configure CloudFront to forward headers to your application, which causes CloudFront to cache multiple versions of an object based on the values in one or more request headers. See [CloudFront's documentation](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html#header-caching-web) [external link] for more detail. This means the more headers you forward the less caching will take place. Forwarding all headers means no caching will happen.

#### Authentication

Cookie headers are forwarded to your application by default, so cookie-based authentication will work as expected. Other headers, such as HTTP auth, are stripped by default. If you need a different configuration, see the guidance on [Forwarding Headers](#forwarding-headers).

#### Further information

* The CloudFront documentation on headers can be found [here](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior) [external link]
* The CloudFront documentation on cookies can be found [here](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) [external link]
