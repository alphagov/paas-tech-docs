## Deploy a Node.js app


This section covers how to deploy a basic Node.js application to GOV.UK PaaS. See the Cloud Foundry [Tips for Node.js Applications](http://docs.cloudfoundry.org/buildpacks/node/node-tips.html) [external link] for more details.

> If your app requires a [backing service](/#deploy-a-backing-or-routing-service), it must be able to work with one of the services supported by PaaS. Instructions for deploying both backing service and non-backing service apps are given in this section.

These instructions assume you have already carried out the setup process explained in the [Quick Setup Guide](/#quick-setup-guide) section.

This is the code for the example app we are going to use. It is a basic web server that responds with a 'Hello World' message.

    const http = require('http');

    const port = process.env.PORT || 3000;

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello World\n');
    });

    server.listen(port, () => {
      console.log(`Server running on ${port}/`);
    });

1. Save the code to a new local directory as ``example.js``.

1. Add this ``manifest.yml`` file to the same directory:

        ---
        applications:
        - name: my-node-app
          command: node example.js
          memory: 256M
          buildpack: nodejs_buildpack

    Replace ``my-node-app`` with a unique name for your app. (You can use ``cf apps`` to see apps which already exist).

    The `memory` line tells the PaaS how much memory to allocate to the app.

    A buildpack provides any framework and runtime support required by an app. In this case, because the app is written in Node.js, you use the ``nodejs_buildpack``.

3. Include an npm ``package.json`` file to specify dependencies. The file should also specify a `start` command used to launch the app.
  
    This is a ``package.json`` file for our example app:

        {
          "name": "example",
          "version": "0.0.1",
          "author": "Demo",
          "engines": {
            "node": "6.11.x"
          }
        }

    The ``"engines"`` values specify the versions of Node.js and npm that the PaaS should use to run your app. Note that older versions may not be available: if your version is not supported, you will see an error message when you try to upload and start the app.

1. You can optionally run `npm install` to preinstall dependencies rather than having them added during the PaaS staging process.

1. Run `cf push APPNAME` from the top level of the directory which contains all the code and configuration files. 

  If you want to upload the app without starting it (for example, if you need to create a PostgreSQL service), run `cf push --no-start APPNAME`, then when you are ready to start the app, run `cf start APPNAME`.

See [Tips for Node.js Applications](https://docs.cloudfoundry.org/buildpacks/node/node-tips.html) [external link] in the Cloud Foundry documentation for more information.

### PostgreSQL setup with Node.js

These instructions are for deploying a Node.js app with a PostgreSQL database, and can be applied to other backing services. If you require more guidance on deploying an app with [other supported backing services](/#deploy-a-backing-or-routing-service), contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

If your app depends on a backing service such as PostgreSQL, it will need to parse the `VCAP_SERVICES` environment variable to get required details, such as service URLs and credentials.

You must create the service and bind it to your Node.js app as described in the [Deploy a backing service](/#deploy-a-backing-or-routing-service) section.

You can use the [cfenv](https://www.npmjs.com/package/cfenv) module to assist with parsing the environment variables.

In your ``package.json`` file, you would specify ``cfenv`` as a dependency:

        {
          // ...
          "dependencies": {
            "cfenv": "*",
            // ...
          }
        }
    

Then in your app, you can easily get configuration information for backing services. This is an example of how to connect to a PostgreSQL service.

        var cfenv = require("cfenv");
        var pg = require('pg');
        var appEnv = cfenv.getAppEnv();
        var connectionString = appEnv.getServiceURL("SERVICE NAME");
        var client = new pg.Client(connectionString);
        client.ssl = true;
        client.connect();

Replace "SERVICE NAME" in the above code with the exact name of the PostgreSQL service you created. The ``getServiceURL`` function returns a connection string which includes the username and password required to connect to the database.

Further information can be found in:

- the Cloud Foundry [community `cf env` page](https://github.com/cloudfoundry-community/node-cfenv/blob/master/README.md) [external link]
- the Cloud Foundry [documentation on environment variables](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html) [external link]

You should also remember to include dependencies for any service bindings in ``package.json``.

    {
      // ...
      "dependencies": {
        "pg": "*",
        // ...
      }
    }

