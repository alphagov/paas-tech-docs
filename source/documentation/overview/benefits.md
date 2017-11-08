## Benefits

Right now, development teams spend considerable time and money setting up all the components required to host a government service. With GOV.UK PaaS, development teams can save on this effort by using a hosting stack that’s already been developed.

Your development team can use PaaS to deploy and run government applications written in a range of languages and web frameworks. You’ll simply need to push your source code to the PaaS environment and the code will be compiled and deployed for you.

PaaS makes user management easy by providing development teams with privilege separation options, for example an ‘admin’ user will be able to assign other team members certain permissions from their PaaS console.

PaaS is deployed to multiple availability zones, making it resilient.

PaaS is accredited for information up to OFFICIAL.

The platform itself is supported 24/7 by GDS, although this does not include application support.

Features of the PaaS platform currently include:

*   support for [multiple backing services](#deploy-a-backing-or-routing-service)
*   language support through the [standard Cloud Foundry buildpacks](http://docs.cloudfoundry.org/buildpacks/) [external link] except .NET Core
*   limited support for custom buildpacks
*   support for public and private Docker images
*   ability to stream application logs to Software as a Service logging platforms

### Coding in the open

We are making all new GOV.UK PaaS source code open and reusable. You can use our source code if you want to support a different backing service (any networked attached service that your application consumes to do its job, for example a MongoDB instance or a PostgreSQL database).

### Characteristics of GOV.UK PaaS
This table summarises the core characteristics of the PaaS offering.

|PaaS characteristic| Meaning|
|:---	|:---	|
| Multi-tenant architecture| Applications running on the platform are isolated from each other and can’t read or change each other’s code, data or logs (eg the Digital Marketplace application can’t access the data of the GOV.UK publishing platform).|
| Application development teams manage their own user support|   A platform where [people developing applications also support the application out of hours](http://www.infoq.com/presentations/gov-uk-devops) leads to better software and a better user experience.	|
|Self-service model|PaaS makes it easy for development teams to get started, and to make frequent changes to their applications without requiring support from a member of the PaaS team (eg they can create a Postgres instance). Because application teams have this complete control, they won’t experience any unnecessary delays. |
|Can use multiple public clouds|   PaaS isn’t locked into a single provider in order to encourage price competition, and to also remove the risk of a [single point of failure](https://en.wikipedia.org/wiki/Single_point_of_failure)	|
