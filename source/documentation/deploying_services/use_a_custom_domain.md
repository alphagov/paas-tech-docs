## Using a custom domain

This section explains how to configure the domain name of your service for production applications.

When you use a custom domain you can also take advantage of the following:

1. Fast delivery of content to your users via Content Distribution Network (CDN) caching (using [AWS CloudFront](https://aws.amazon.com/cloudfront/)).

2. Encrypted user traffic via HTTPS support. This option comes with free TLS certificates with auto-renewal (using [Let's Encrypt](https://letsencrypt.org/)).

### How to create an instance of this service

To see the plans available you can run:

```bash
cf marketplace -s cdn-route
```

Before you begin, note that once you create a CDN service instance you can't update or delete it until it has been successfully configured. This means if you make a mistake that prevents it from being successfully configured, you'll need to ask support to manually delete the service instance.

First, target the space your application is running in:

```bash
cf target -o ORGNAME -s SPACENAME
```

Create a domain in your organisation (replace `ORGNAME` with your org name, and replace `example.com` with your domain):

```bash
cf create-domain ORGNAME example.com
```

Map the route to your app:

```bash
cf map-route APPNAME example.com
```

Create a `cdn-route` service instance by running the following command, replacing `my-cdn-route` with a name for your service instance, and `example.com` with your domain:

```bash
cf create-service cdn-route cdn-route my-cdn-route \
    -c '{"domain": "example.com"}'
```

This command includes `cdn-route cdn-route` because `cdn-route` is the name of the service *and* the name of the service plan.

If you have more than one domain you can pass a comma-delimited list to the `domain` parameter. Keep in mind that the broker will wait until all domains are CNAME'd, as explained in the next step:

```bash
cf create-service cdn-route cdn-route my-cdn-route \
    -c '{"domain": "example.com,www.example.com"}'
```

The maximum number of domains that can be associated with a single cdn-route service instance is 100.

#### How to set up DNS

**Note:** If you are creating a new site on GOV.UK PaaS, or you are migrating an existing site to GOV.UK PaaS that can tolerate a small amount of downtime during the migration, you can skip the first step and proceed directly to [Create CNAME record(s)](#step-2-create-cname-record-s).

##### Step 1: Create TXT record(s)

Once you've created the service instance you need to retrieve the instructions to set up your DNS. Run the following command, replacing `my-cdn-route` with the service instance name you used in the previous step.

```bash
$ cf service my-cdn-route

Last Operation
Status: create in progress
Message: Provisioning in progress [example.com => origin-my-paas-app.cloudapps.digital]; CNAME or ALIAS domain example.com to d3nrs0916m1mk2.cloudfront.net or create TXT record(s):
name: _acme-example.com., value: ngd2suc9gwUnH3btm7N6hSU7sBbNp-qYtSPYyny325E, ttl: 120

```
Create the TXT record(s) as instructed by the broker. The existence of these records will be validated by [Let's Encrypt](https://letsencrypt.org/) when issuing your certificate and will not affect your site.

After the records have been created you will have to wait for up to an hour for the certificate to be provisioned. Your certificate has been provisioned when the `cf service my-cdn-route` command reports the status as `create succeeded`.

```
Last Operation
Status: create succeeded
Message: Service instance provisioned [example.com => origin-my-paas-app.cloudapps.digital]; CDN domain d3nrs0916m1mk2.cloudfront.net
```

It may take some time for CloudFront to serve your origin from all locations. You can check in advance by hitting CloudFront and passing the custom domain in the `Host` header, using the example below. The CloudFront domain can be found in the output of the command above.

```
curl -H "Host: <Custom domain>" https://<CloudFront domain>/
```

When this is working consistently, you can flip your DNS record to start serving content from the CDN. You may still have to wait for up to an hour to make sure the CloudFront distribution is updated everywhere.

##### Step 2: Create CNAME record(s)

Once the TXT records have been validated, or if you've decided to skip that step, you need to point your custom domain at the CDN. Run `cf service my-cdn-route` with the service instance name you choose.

```
Last Operation
Status: create succeeded
Message: Service instance provisioned [example.com => origin-my-paas-app.cloudapps.digital]; CDN domain d3nrs0916m1mk2.cloudfront.net
```

The output will include the CDN domain the broker has created for you. In this case you need to create a CNAME record in your DNS server pointing `example.com` to `d3nrs0916m1mk2.cloudfront.net.`.

After the record is created wait for up to an hour for the CloudFront distribution to be provisioned and the DNS changes to propagate. Then visit your custom domain and see whether you have a valid certificate - in other words, that visiting your site in a modern browser doesn't give you a certificate warning.

#### CDN Configuration Options

##### Options available

Name | Required | Description | Default
--- | --- | --- | ---
`domain` | *Required* | Your custom domain (or domains separated by commas) |
`cookies` | *Optional* | Forward cookies to the origin | `true` |
`headers` | *Optional* | A list of headers to forward to the origin | `["Host"]` |

##### Cookies

[Forwarding cookies to your origin](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Cookies.html) can be disabled by setting the `cookies` parameter to `false`.

```bash
cf create-service cdn-route cdn-route my-cdn-route \
    -c '{"domain": "example.com", "cookies": false}'
```

##### Headers

By default our service broker configures CloudFront to forward the `Host` header to your app. Depending on [how CloudFront handles certain headers](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior) [external link], you may want to whitelist extra headers:

```bash
cf create-service cdn-route cdn-route my-cdn-route \
    -c '{"domain": "example.com", "headers": ["Accept", "Authorization"]}'
```

You can supply up to nine headers. If you need to allow more headers you will have to forward all headers:

```bash
cf create-service cdn-route cdn-route my-cdn-route \
    -c '{"domain": "example.com", "headers": ["*"]}'
```

Note that forwarding headers has a negative impact on cacheability. See the [More about how the CDN works](#more-about-how-the-cdn-works) section for details.

#### Troubleshooting

If your custom domain isn't working:

* make sure you've waited at least an hour
* check your DNS setup to make sure you completed the CNAME record creation.

If you get the following error message when you try to update or delete a service instance:

```
Server error, status code: 409, error code: 60016, message: An operation for service instance [name] is in progress.
```

this happens because you can't do anything to a service instance while it's in a pending state. A CDN service instance stays pending until it detects the CNAME or ALIAS record. If this causes a problem for you ask support to manually delete the pending instance.

### How to update a service instance

To update a service instance, run the following command (replace `my-cdn-route` with your service instance name, and replace `example.com` with your domain):

```bash
cf update-service my-cdn-route -c '{"domain": "example.com"}'
```

After the record is updated, wait up to an hour for the CloudFront distribution to be updated and the DNS changes to propagate. You may also have to clear your browser's cache if it shows the old content after the DNS changes propagate.

#### When to update the DNS

You only need to add a CNAME entry when you update the `domain` field. If you do, follow [How to set up DNS](#how-to-set-up-dns) again.

#### Deleting a service instance

After you delete an existing service instance you may have to wait for up to an hour for the changes to complete and propagate.

### More about how the CDN works

#### Caching

CloudFront uses your application's `Cache-Control` or `Expires` HTTP headers to determine [how long to cache content](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html). If your application does not provide these headers, CloudFront will use a default timeout of **24 hours**. This can be particularly confusing as different requests might be routed to different CloudFront Edge endpoints.

While there is no mechanism for GOV.UK PaaS users to trigger a cache clear, [GOV.UK PaaS support](https://www.cloud.service.gov.uk/support.html) can. Cache invalidation is not instantaneous; Amazon recommends expecting a lag time of 10-15 minutes (more if there are many distinct endpoints).

You can configure CloudFront to forward headers to your app, which causes CloudFront to cache multiple versions of an object based on the values in one or more request headers. See [CloudFront's documentation](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html#header-caching-web) [external link] for more detail. This means the more headers you forward the less caching will take place. Forwarding all headers means no caching will happen.

#### Authentication

As noted above, cookies are passed through the CDN by default, meaning that cookie-based authentication will work as expected. Other headers, such as HTTP auth, are stripped by default. If you need a different configuration, see the above guidance on [CDN configuration options](#cdn-configuration-options).
