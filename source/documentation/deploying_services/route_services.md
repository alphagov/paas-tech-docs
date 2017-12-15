## Route services

Tenants may wish to apply some processing to requests before they reach an application. Common examples of use cases are authentication, rate limiting, and caching services.

Cloud Foundry allows the tenants to bind [application routes](/#names-routes-and-domains) to [route services](https://docs.cloudfoundry.org/services/route-services.html) [external link]. A route service acts as a full proxy. Once it is bound to a route, the platform routing layer will send every request for that route to the route service endpoint. The route service can then process the incoming request, proxy it back to the original application, and finally process the response request before returning it to the original client.

Using route services has some consequences to be aware of:

- Every request will include additional latency as it will be proxied via the Routing Service.
- The route service will be able to access all the request content in clear.
- The route service would become a critical point of failure, and if it is not available, the application will not be available for the end users.

### User-provided Route Services

Tenants can define their own route service instance by using a [user-provided service instance](/#user-provided-service-instance) that points to any HTTPS service. This endpoint must fulfill the following requirements:

- It must be a HTTPS endpoint with a valid certificate.
- It can be a application running in the platform itself or an external service on the Internet.
- It must be reachable from the platform (ie. not blocked by a firewall or in a private network).
- It must implement the [route service protocol](/#implementing-a-route-service)

This is how you define an user-provided route service instance and map it to the route of your app:

1. From the command line, run:

   ``cf create-user-provided-service SERVICE_INSTANCE -r ROUTE_SERVICE_URL``

   where `SERVICE_INSTANCE` is a unique, descriptive name for this route service instance, and `ROUTE_SERVICE_URL` is the url of the route service endpoint; for example:

   ``cf create-user-provided-service my-route-service -r https://route-service.example.org``

   the service will be immediately ready to be used, and you can query its status by running:

   ``cf service my-route-service``


2. Bind this route service instance to the [application route](/#names-routes-and-domains)

   ``cf bind-route-service DOMAIN SERVICE_INSTANCE --hostname HOSTNAME``

   where `DOMAIN` is the domain used by your application, likely the default one `cloudapps.digital`, `SERVICE_INSTANCE` the name of the service that you have just created, and `HOSTNAME` the host or app name assigned to the app. For example:

   ``cf bind-route-service cloudapps.digital my-route-service --hostname myapp``

3. You can list the [routes](/#names-routes-and-domains) of the current [space](/#organisations-spaces-amp-targets), to see the applications and route services bound to them:

   ``cf routes``

If the route service endpoint is not responding correctly, you might get the following response when querying the route:

   ``502 Bad Gateway: Registered endpoint failed to handle the request.``

If you get this error, double check that the endpoint is working and reachable from the platform, that it is using a valid SSL certificate, that responds timely and that it implements the [route service protocol](/#implementing-a-route-service).

### Implementing a route service

A route service can be implemented as a HTTPS application that will receive all requests for the associated route from the Cloud Foundry router. The request will contain the following additional headers:

- `X-CF-Forwarded-Url` header contains the URL of the application route. The route service should forward the request to this URL.
- `X-CF-Proxy-Signature` and `X-CF-Proxy-Metadata`: Signature and metadata used by the platform route itself to validate the request sent by the route service.
  The route service must always include these headers.

The route service must proxy back the request to the application route defined in header `X-CF-Forwarded-Url` within 60 seconds, otherwise the request will be refused. In addition, the total time to process the request and send a response back must be within 900 seconds.

![Route service request life cycle](images/route-service.png)

You can refer to the [Cloud Foundry documentation](https://docs.cloudfoundry.org/services/route-services.html#service-instance-responsibilities), [example route services](https://docs.cloudfoundry.org/services/route-services.html#examples), and [tutorial](https://docs.cloudfoundry.org/services/route-services.html#tutorial) [external links] to learn more about how to implement route services.

### Example: Route service to add authentication

In the following example we will add a route service to provide basic HTTP authentication to the bound routes. This can be used to restrict access to a beta application.

An example of such a route service application code can be found in [cf basic auth route service](https://github.com/alext/cf_basic_auth_route_service) [external link].
Please note this is a proof-of-concept and is *not intended to run in production*.

We will deploy it as an application in the platform itself. Then we will bind this route service to a deployed application called `myapp`, accessible via https://myapp.cloudapps.digital.

1. Deploy the route service as [any other other application](/#deploying-apps).
   Do not start it yet, as we need to configure it first.

    ```
    git clone https://github.com/alext/cf_basic_auth_route_service
    cd cf_basic_auth_route_service
    cf push my-basic-auth-service-app --no-start
    ```

   Note: You might want to change `my-basic-auth-service-app` with a different name to avoid conflicts with other tenants' apps.

2. This example route service can only authenticate one user with fixed username and password. Choose any value for username and password then pass them to the application via environment variables `AUTH_USERNAME` and `AUTH_PASSWORD`. Finally the route service can be started:

    ```
    cf set-env my-basic-auth-service-app AUTH_USERNAME myuser
    cf set-env my-basic-auth-service-app AUTH_PASSWORD pass1234
    cf start my-basic-auth-service-app
    ```

   The new service is serving in https://my-basic-auth-service-app.cloudapps.digital.

3. Register the route service endpoint as an user-provided service instance:

    ```
    cf create-user-provided-service my-basic-auth-service -r https://my-basic-auth-service-app.cloudapps.digital
    ```

4. Finally, bind the route service to the application route:

    ```
    cf bind-route-service cloudapps.digital my-basic-auth-service --hostname myapp
    ```

The application in https://myapp.cloudapps.digital will now ask for basic HTTP authentication, with login `myuser` and password `pass1234`.
