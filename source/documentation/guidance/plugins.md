
## Useful Cloud Foundry plugins

There are some community-contributed plugins that are useful in different situations: 

- [App AutoScaler plugin](https://plugins.cloudfoundry.org/#app-autoscaler-plugin) lets you set and adjust the [autoscaling rules](https://docs.cloud.service.gov.uk/managing_apps.html#autoscaling) for your applications from your command line interface (CLI)
- [Buildpack usage plugin](https://github.com/csterwa/cf_buildpacks_usage_cmd) allows you to check if you’re using a buildpack that will be affected when the GOV.UK Platform as a Service (PaaS) team updates the default buildpacks
- [Log Cache CLI plugin](https://github.com/cloudfoundry/log-cache-cli#installing-plugin) gives you more advanced log filtering from the log buffer by allowing you to filter by time, type or class of log
- [Open plugin](https://plugins.cloudfoundry.org/#open) gives you the links to your applications from your command line and opens your browser directly to them
- [Route Lookup CLI plugin](https://github.com/18F/cf-route-lookup) determines which route is attached to which app
- [Top plugin](https://plugins.cloudfoundry.org/#top) lets you see how your applications are performing within GOV.UK PaaS and warns if you are running out of memory or CPU

The Cloud Foundry open source community maintains these plugins, and we are not responsible for updating them.

Other [Cloud Foundry plugins](https://plugins.cloudfoundry.org/) are also available.

### Using the Conduit plugin

Some GOV.UK PaaS backing services (PostgreSQL, MySQL and Redis) only accept connections from GOV.UK PaaS apps. You’ll need to connect through a GOV.UK PaaS app to access one of these backing services from your local machine. We have created the [Conduit](https://plugins.cloudfoundry.org/#conduit) plugin and written some [guidance on using the Conduit plugin](/guidance.html#conduit) to simplify this process. 

Conduit lets you connect to your remote backing service instances from your local system. This allows you to use the standard tool for your backing service, for example, [`psql`](https://www.postgresql.org/docs/12/app-psql.html) for PostgreSQL or [`mysql`](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) for MySQL CLI tools to [make backups](https://docs.cloud.service.gov.uk/deploying_services/postgresql/#paas-to-paas) and [interrogate your backing services](https://docs.cloud.service.gov.uk/deploying_services/postgresql/#connect-to-a-postgresql-service-from-your-local-machine). 

### Connect to a backing service from your local machine

To install this plugin, run the following code from the command line:

```
cf install-plugin conduit
```

You’ll see the following warning:

```

Attention: Plugins are binaries written by potentially untrusted authors.
Install and use plugins at your own risk.
Do you want to uninstall the existing plugin and install conduit VERSION? [yN]:

```

Select ‘y’ to continue with the installation.

Once the plugin has finished installing, run the following code to get credentials and a local address through which to access the backing service:

```
cf conduit SERVICE_NAME
```

`SERVICE_NAME` should be a unique descriptive name for this service instance.


To connect to the backing service using your chosen tools, use the username, password, port and URI given in the output from Conduit.

```
The following services are ready for you to connect to:

* service: SERVICE_NAME (BACKING_SERVICE_TYPE)
  host: 127.0.0.1
  jdbcuri: jdbc:postgresql://127.0.0.1:PORT/A_RESOURCE?password=PASSWORD&user=USERNAME
  name: A_RESOURCE
  password: PASSWORD
  port: PORT
  uri: postgres://USERNAME:PASSOWRD@127.0.0.1:PORT/A_RESOURCE
  username: USERNAME

```

Where:
- BACKING_SERVICE_TYPE is the type of the backing service (for example, PostgreSQL)
- USERNAME is the username to connect to the service
- PASSWORD is the password for the user
- PORT is the port on which to connect
- A_RESOURCE is the name of the resource as given by the service provider (for example, the database name)

Run `cf conduit --help` for more options, and refer to the [Conduit README](https://github.com/alphagov/paas-cf-conduit/blob/master/README.md) for more information on how to use the plugin.

See the [PostgreSQL documentation](https://docs.cloud.service.gov.uk/deploying_services/postgresql/#connect-to-a-postgresql-service-from-your-local-machine) and [MySQL documentation](https://docs.cloud.service.gov.uk/deploying_services/mysql/#connect-to-a-mysql-service-from-your-local-machine) for specific information on how to use Conduit with those backing services. 

## Deleting Conduit applications

The Conduit application creates and deploys GOV.UK PaaS apps with names like `__conduit_RANDOM_STRING__` (for example, `__conduit_aeganmtr__`) in your space. Conduit should tidy the apps up by itself when the session ends, but if it does not, it is safe to delete them yourself. Before you delete them, make sure nobody else on your team is using Conduit to connect to the same database.

