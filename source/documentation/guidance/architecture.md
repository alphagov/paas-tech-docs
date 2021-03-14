# GOV.UK PaaS Architecture

## Characteristics of GOV.UK PaaS

### Multi-tenant architecture

Applications running on the platform are isolated from each other and can’t read or change each other’s code, data or logs (for example the Digital Marketplace application can’t access the data of the GOV.UK publishing platform).

### App development teams manage their own user support

A platform where [people developing applications also support the application out of hours](http://www.infoq.com/presentations/gov-uk-devops) leads to better software and a better user experience.

### Self-service model

PaaS makes it easy for development teams to get started, and to make frequent changes to their applications without requiring support from a member of the PaaS team (for example they can create a Postgres instance). Because application teams have this complete control, they won’t experience any unnecessary delays.

## 12-factor application principles

Your app must follow these practices to work on the Cloud Foundry technology which is used by GOV.UK PaaS. Following these principles during development should make your apps scalable and easy to deploy.

We have summarised the practices in the table below, and noted the relevance of each principle to GOV.UK PaaS.

Visit the [12factor.net website](https://12factor.net/) to further ensure your application supports these practices.

<div style="height:1px;font-size:1px;">&nbsp;</div>

|Principle|Meaning|Relevance to Cloud Foundry|
|:---|:---|:---|
|# One codebase many deploys  |Each of your apps needs its own version-controlled repository.  |You can push the same codebase to many Cloud Foundry applications with these commands: <br>``` $ cf push myapp-staging``` <br/> ```$ cf push myapp-production```  |
|# Isolate dependencies |All required dependencies (for example a database or image library) must be vendored into your software system.|If you don’t declare your dependencies, you probably won’t be able to deploy your application on Cloud Foundry. How you specify dependencies depends on which language and buildpack you use. For example, the python buildpack expects you to provide a requirements.txt file which it will pass to pip.  |
|# Store your configuration in the environment  | Ensure you separate the storage of your code and configuration (this is anything that may vary between environments, such as passwords). |Cloud Foundry provides environment variables to tell an application how to configure itself, for example, VCAP_SERVICES tells applications what services are available and how to connect to them. You can create your own environment variables for each application. |
|# Backing Services  |All your backing services (for example, an email service or a monitoring system) should be loosely coupled to your code so you can easily change services if you need to. A change in service should not require a code change.|In Cloud Foundry, backing services are referred to as ‘services’. Users can create services, bind them to applications, and delete them.  |
|# Strictly separate build, release and run stages  |There should be a strict separation between building, releasing and running the code.  |The build stage is carried out by the buildpack and Cloud Foundry refers to this as ‘staging’ an app. Cloud Foundry combines the release and run stage into a single 'push' stage. |
|# Stateless processes  |Build stateless applications where intermediate data is stored in your backing services (for example your databases) and not in your running code. Also, have your applications run on many servers so you can ensure continuity in the event of server downtime.  | Cloud Foundry treats all application processes as stateless and expendable.|
|# Port binding  |Your application should interface to the world through an API. You can have a separate URL for your customers than the one you use for internal calls. This means your app can be used as a backing service for another app  its URL.  | Cloud Foundry expects applications to have this and provides an environment variable called PORT for the application to use as part of its bootstrapping process. |
|# Concurrency  | Ensure all your processes (for example, web requests or API calls) are running separately so your application can scale easily.  | Cloud Foundry expects applications to behave according to this principle. To increase the number of processes running, use the ```cf scale``` command.|
|# Disposability  | You should be able to rapidly release new code. Also, applications should be able to start back up fast and cleanly following shut down.  | Cloud Foundry expects applications to follow this principle.|
|# Development/Production parity  | Applications should be rapidly deployed from their development environment to production.  To ensure this rapid deployment, keep a developer’s environment similar to that of production (for example both environments should use the same backing services).  | CF helps you achieve this development/production parity by letting you create and deploy similar services for development, test and production environments|
|# Logs  | Maintain and archive log files so you have visibility of how your application works over time.  |Cloud Foundry has [documentation on logging files](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html).|
|# Administrative processes  |Run one-off administrative processes (for example running analytics) in your production environment. | You can run administrative processes as [tasks in Cloud Foundry](https://docs.cloudfoundry.org/devguide/using-tasks.html). |

<div style="height:1px;font-size:1px;">&nbsp;</div>
