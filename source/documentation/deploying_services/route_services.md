## Route services

Tenants may wish to apply some processing to requests before they reach an application. Common examples of use cases are authentication, rate limiting, and caching services.

Cloud Foundry allows the tenants to bind [application routes](/#names-routes-and-domains) to [Route Services](https://docs.cloudfoundry.org/services/route-services.html) [external-link]. A Route Service acts as a full proxy. Once it is bound to a route, the platform routing layer will send every request for that route to the Route Service endpoint. The Route Service can then process the incoming request, proxy it back to the original application, and finally process the response request before returning it to the original client.

Using Route Services has some consequences to be aware of:

- Every request will be penalised with some additional latency as it will be proxied via the Routing Service.
- The Route Service will be able to access all the request content in clear.
- The Route Service would become a critical point of failure, and if it is not available, the application will not be available for the end users.

### User-Provided Route Services

Tenants can define their own Route Service instance by using a [User-Provided Service Instance](/#user-provided-service-instance) that points to any HTTPS service. This endpoint must fulfill the following requirements:

- It must be a HTTPS endpoint with a valid certificate.
- It can be a application running in the platform itself or a external service in the Internet.
- It must be reachable from the platform (ie. not blocked by a firewall or in a private network).
- It must implement the [Route Service Protocol](/#route-service-protocol)

This is how you define a User-Provided Route Service Instance and map it to the route of your app:

1. From the command line, run:

   ``cf create-user-provided-service SERVICE_INSTANCE -r ROUTE_SERVICE_URL``

   where `SERVICE_INSTANCE` is a unique, descriptive name for this Route Service Instance, and `ROUTE_SERVICE_URL` is the url of the route service endpoint; for example:

   ``cf create-user-provided-service my-route-service -r https://route-service.example.org``

   the service will be immediately ready to be used, and you can query its status by running:

   ``cf service my-route-service``


2. Bind this Route Service Instance to the [application route](/#names-routes-and-domains)

   ``cf bind-route-service DOMAIN SERVICE_INSTANCE --hostname HOSTNAME``

   where `DOMAIN` is the domain used by your application, likely the default one `cloudapps.digital`, `SERVICE_INSTANCE` the name of the service that you have just created, and `HOSTNAME` the host or app name assigned to the app. For example:

   ``cf bind-route-service cloudapps.digital my-route-service --hostname myapp``

3. You can list the [routes](/#names-routes-and-domains) of the current [space](https://docs.cloud.service.gov.uk/#organisations-spaces-amp-targets), to learn the applications and Route Services bound to them:

   ``cf routes``

If the Route Service endpoint is not responding correctly, you might get the following response when querying the route:

   ``502 Bad Gateway: Registered endpoint failed to handle the request.``

If you get this error, double check that the endpoint is working and reachable from the platform, that it is using a valid SSL certificate, that responds timely and that it implements the [Route Service Protocol](/#implementing-a-route-service).

### Implementing a Route Service

A Route Service can be implemented as a HTTPS application that will receive all requests for the associated route from the Cloud Foundry router. The request will contain the following additional headers:

- `X-CF-Forwarded-Url` header contains the URL of the application route. The route service should forward the request to this URL.
- `X-CF-Proxy-Signature` and `X-CF-Proxy-Metadata`: Signature and metadata used by the platform route itself to validate the request sent by the route service.
  The route service must always include these headers.

The Route Services must proxy back the request to the application route defined in header `X-CF-Forwarded-Url` within 60 seconds, otherwise the request will be refused. In addition, the total time to process the request and send a response back must be within 900 seconds.

![Route Service request life cycle](images/route-service.png)

You can refer to the [Cloud Foundry documentation](https://docs.cloudfoundry.org/services/route-services.html#service-instance-responsibilities), [example route services](https://docs.cloudfoundry.org/services/route-services.html#examples), and [tutorial](https://docs.cloudfoundry.org/services/route-services.html#tutorial) to learn more about how to implement route services.
