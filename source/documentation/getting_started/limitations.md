##Limitations

While GOV.UK PaaS is built using Cloud Foundry technology, we don't support all Cloud Foundry features. This section explains some Cloud Foundry features that are not enabled, as well as some limitations of the beta phase.

### .NET is not supported with standard buildpacks

Cloud Foundry uses buildpacks to provide runtime and framework support for applications in different languages. 

GOV.UK PaaS supports both [standard buildpacks](https://docs.cloudfoundry.org/buildpacks/) [external link] and [custom buildpacks](https://docs.cloudfoundry.org/buildpacks/custom.html) [external link]. Please note that the [.NET Core buildpack](https://docs.cloudfoundry.org/buildpacks/dotnet-core/index.html) [external link] is only available as a custom buildpack.

### 404s after commands that restart the app

After you use a command that restarts application instances, such as ``cf push`` or ``cf restart``, your app may briefly return incorrect 404 errors. Apart from the brief downtime, this may lead to problems if the 404 is cached, or visiting web crawling bots (as used by search engines) receive a 404.

Commands known to do this are:

- ``cf push``
- ``cf restage``
- ``cf restart``
- ``cf scale`` when changing disk or memory limits or forcing a restart

We are working on a fix to prevent this happening.

In the meantime, we suggest that you use a [blue-green deployment process](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html) [external link], where you have two versions of an app, one that is 'live' and one that is undergoing an update or restart. There are plugins for the Cloud Foundry command line client to facilitate this process. We can recommend the [cf-blue-green-deploy](https://github.com/bluemixgaragelondon/cf-blue-green-deploy) plugin.

### API access may have brief outages during beta

During the beta period, there may be occasional brief periods where API access is unavailable during a platform update, causing commands sent from the command line client to fail. 

If you find that a valid command is failing and the error message does not explain the problem, please wait 5 minutes before trying the command again. If the error persists for more than 5 minutes, it is unlikely to be caused by a platform update and you should contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).  

We are working on a fix to prevent the interruption of API access when we update the platform.
