# Set up a custom domain by configuring your own CDN

There are two ways to configure your own CDN:

 - use Cloud Foundry commands
 - amend HTTP request headers

You should use these methods if you need access to features that are not provided by the `cdn-route` service. The [`cdn-route`](/deploying_services/use_a_custom_domain/#set-up-a-custom-domain-using-the-cdn-route-service) section has information on the features provided by the service.

There are many different CDNs available. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) to discuss best practice for configuring your CDN to work with the PaaS.

### Use Cloud Foundry commands

#### Set up connection between custom domain and CDN

1. Register your custom domain with a domain name registrar.

2. Choose a CDN provider.

3. Set up the connection between your custom domain and the CDN provider, following the CDN provider’s instructions.

#### Configure your custom domain in Cloud Foundry

1. Target the space your application is running in:

    ```bash
    cf target -o ORGNAME -s SPACENAME
    ```

2. Create a domain in your organisation (replace `ORGNAME` with your org name, and replace `example.com` with your domain):

    ```bash
    cf create-domain ORGNAME example.com
    ```

3. Map the subdomain route to your application:

    ```bash
    cf map-route APPNAME example.com --hostname www
    ```

#### Configure your CDN

Configure your CDN to forward HTTPS traffic to the PaaS at your [app domain](/orgs_spaces_users.html#regions), providing a HTTP `Host` header for your custom domain (for example `Host: www.example.com`).

For example, if your app is hosted in the London region, your app domain is `london.cloudapps.digital`. When your CDN connects to the `london.cloudapps.digital` server, the server will present a TLS certificate valid only for `london.cloudapps.digital` and `*.london.cloudapps.digital`. Your CDN must accept this certificate.

### Amend HTTP request headers

#### Set up connection between custom domain and CDN

1. Register your custom domain with a domain name registrar.

2. Choose a CDN provider.

3. Set up the connection between your custom domain and the CDN provider, following the CDN provider’s instructions.

#### Configure your CDN

1. Configure your CDN to forward HTTPS requests from your custom domain to the PaaS at the `YOURAPP.APP_DOMAIN` domain.

2. Configure your CDN to amend the HTTP requests when it forwards those requests by:

  - changing the HTTPS request `Host` header from your custom domain to your app’s domain (for example if your app is hosted in the London region, change `Host: www.example.com` to `Host: YOURAPP.london.cloudapps.digital`)

  - adding a `X-Forwarded-Host` HTTP header containing your custom domain to the HTTPS request (for example `X-Forwarded-Host: www.example.com`)


In the above example, the HTTP request header will change from:

```
GET / HTTP/1.1
Host: www.example.com
```

to:

```
GET / HTTP/1.1
Host: YOURAPP.london.cloudapps.digital
X-Forwarded-Host: www.example.com
```

#### Configure your app

Configure your app to obtain its hostname from the `X-Forwarded-Host` HTTP header.
