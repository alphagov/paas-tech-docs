## Using a custom domain

This section explains how to configure a custom domain name for your application by configuring your own CDN.

There are two ways to configure your own CDN:

- Use Cloud Foundry commands
- Amend HTTPS request host headers

### Use Cloud Foundry commands

#### Set up connection between custom domain and CDN 

1. Register your custom domain with a domain name registrar.

1. Sign up for a CDN.

1. Set up the connection between your custom domain and the CDN provider, following the CDN provider’s instructions as needed.

#### Configure your custom domain in Cloud Foundry

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

#### Configure your CDN

Configure your CDN to forward HTTPS traffic to the PaaS at the `cloudapps.digital` domain, providing a HTTP Host header for your custom domain (for example `Host: example.com`) .

When your CDN connects to the `cloudapps.digital` server, that server will present a TLS certificate that is valid only for `cloudapps.digital` and `*.cloudapps.digital`. Your CDN must accept this certificate.

There are many different CDNs available. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](gov-uk-paas-support@digital.cabinet-office.gov.uk) to discuss best practice for configuring your CDN to work with the PaaS.

### Amend HTTPS request host headers

#### Set up connection between custom domain and CDN 

1. Register your custom domain with a domain name registrar.

1. Sign up for a CDN.

1. Set up the connection between your custom domain and the CDN provider, following the CDN provider’s instructions as needed.

#### Configure your CDN

You must configure your CDN to forward HTTPS requests from your custom domain to the PaaS at the `YOURAPP.cloudapps.digital` domain. 

You must also configure your CDN to amend the HTTPS requests when it forwards those requests:

- change the HTTPS request host header from your custom domain to your app’s domain (for example, change `Host: example.com` to `Host: YOURAPP.cloudapps.digital`) 

- add a X-Forwarded-Host HTTP header containing your custom domain to the HTTPS request (for example `X-Forwarded-Host: example.com`)

In the above example, the HTTPS request header will change from: 

```
GET / HTTP/1.1
Host: example.com
```

to:

```
GET / HTTP/1.1
Host: YOURAPP.cloudapps.digital
X-Forwarded-Host: example.com
```

#### Configure your app

Configure your app to obtain its hostname from the `X-Forwarded-Host` HTTP header. 

There are many different CDNs available. Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](gov-uk-paas-support@digital.cabinet-office.gov.uk) to discuss best practice for configuring your CDN to work with the PaaS.
