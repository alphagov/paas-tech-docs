## Deploy a Ruby on Rails app

This section explains minimal steps for deploying a basic Rails app. Refer to the [Cloud Foundry guide to deploying Ruby on Rails apps](https://docs.cloudfoundry.org/buildpacks/ruby/gsg-ror.html) for more information.

> If your app requires a [backing service](/deploying_services/#deploy-a-backing-or-routing-service), it must be able to work with one of the services supported by PaaS. Instructions for deploying both backing service and non-backing service apps are given in this section.

These steps assume you have already carried out the setup process explained in the [Get started](/get_started.html#get-started) section.

When you deploy an app, you must select a combination of an organisation and a space. This is called the [**target**](/deploying_apps.html#set-a-target).

We have provided a ``sandbox`` space for you to use for learning about the PaaS. You may want to target the sandbox while you are testing by running:

``cf target -s sandbox``

It's also important to realise that if you deploy an app using the same name and target as an existing app, the original will be replaced. If you are not sure about where to deploy your app, consult the rest of your team.

### Deploying an app

To deploy a Rails app that does not require a backing service:

1. Put the code for your Rails app into a local directory (for example, by checking it out of version control).

1. [Exclude files ignored by Git](/deploying_apps.html#excluding-files).

1. If you're using Rails 4, [add the `rails_12factor` gem](https://github.com/heroku/rails_12factor#install) for better logging. Rails 5 has this functionality built in by default.

1. Create a manifest.yml file in the folder where you checked out your app.

        ---
        applications:
        - name: my-rails-app
          memory: 256M
          buildpacks:
          - ruby_buildpack

    Replace ``my-rails-app`` with a unique name for your app. (You can use ``cf apps`` to see apps which already exist).

    The `memory` line tells the PaaS how much memory to allocate to the app.

    A buildpack provides any framework and runtime support required by an app. In this case, because the app is written in Ruby, you use the ``ruby_buildpack``.

1. Upload and start the application by running:

    ```
    cf push APPNAME
    ```

    from the directory which contains all the code and configuration files for your app.

    If you do not specify a name for the app after the ``cf push`` command, the name from the manifest file is used.

1. Set any additional [environment variables](/deploying_apps.html#environment-variables) required by your app. For example:

    ```
    cf set-env APPNAME VARIABLE `value`
    ```

    where VARIABLE is a unique name for the variable, and `value` is the value to set.

Your app should now be available at your [app domain](/orgs_spaces_users.html#regions).

For a production app, you should refer to the [documentation on deploying an app to production](/deploying_apps.html#deploy-an-app-to-production).

### Deploying with a PostgreSQL database

These instructions are for deploying a Rails app with a PostgreSQL database, and can be applied to other backing services. If you require more guidance on deploying an app with [other supported backing services](/deploying_services/#deploy-a-backing-or-routing-service), contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

 The Cloud Foundry buildpack for Ruby automatically gets the details of the first available PostgreSQL service from the ``VCAP_SERVICES`` environment variable and sets the Ruby `DATABASE_URL` environment variable accordingly. Ensure that your app is configured to use `DATABASE_URL` to set its database configuration when deployed to the PaaS.

1. Put the code for your Rails app into a local directory (for example, by checking it out of version control).

1. If you are using Git, you may wish to [exclude files ignored by Git](/deploying_apps.html#excluding-files).

1. If you're using Rails 4, [add the `rails_12factor` gem](https://github.com/heroku/rails_12factor#install) for better logging. Rails 5 has this functionality built in by default.

1. Create a manifest.yml file in the directory where you checked out your app.

        ---
        applications:
        - name: my-rails-app
          memory: 256M
          buildpacks:
          - ruby_buildpack

    Replace ``my-rails-app`` with a unique name for your app. (You can use ``cf apps`` to see apps which already exist).

    The `memory` line tells the PaaS how much memory to allocate to the app.

    A buildpack provides any framework and runtime support required by an app. In this case, because the app is written in Ruby, you use the ``ruby_buildpack``.


1. Upload the app without starting it using this command:

    ```
    cf push --no-start APPNAME
    ```

    from the directory which contains all the code and configuration files for your app.

    If you do not specify a name for the app after the ``cf push`` command, the name from the manifest file is used.


1. Set any additional [environment variables](/deploying_apps.html#environment-variables) required by your app. For example:

    ```
    cf set-env APPNAME VARIABLE `value`
    ```

    where VARIABLE is a unique name for the variable, and `value` is the value to set.


1. [Create a PostgreSQL backing service (if required)](/deploying_services/postgresql/#set-up-a-postgresql-service) and [bind it to your app](/deploying_services/postgresql/#bind-a-postgresql-service-to-your-app).

    To enable Rails support for database migrations, you may wish to create a `Procfile` in the same directory as your `manifest.yml` and `Gemfile`. The `Procfile` is a way to specify commands to be run when deploying your app.

    This is a minimal example of the `Procfile` content for *Rails 5.0*:

    ```
    web: rake db:migrate && bin/rails server
    ```

1. Start your app by running:

    ```
    cf start APPNAME
    ```

Your app should now be available at your [app domain](/orgs_spaces_users.html#regions).

For a production app, you should refer to the [documentation on deploying an app to production](/deploying_apps.html#deploy-an-app-to-production).

### Specify a Ruby version

You should tell Cloud Foundry which version of Ruby your app uses in the Ruby buildpack.

Refer to the documentation on [buildpack language version updates](deploying_apps.html#buildpack-language-version-updates) for more information.

Refer to the [Cloud Foundry documentation on specifying a Ruby version](https://docs.cloudfoundry.org/buildpacks/ruby/index.html#runtime) for more information.

### Web servers

By default, the Cloud Foundry Ruby buildpack [runs `bin/rails server`](https://github.com/cloudfoundry/ruby-buildpack/blob/1f0ac3ce10866390d161c3f27e71d64890859454/lib/language_pack/rails4.rb#L27)
to spin up the application. In Rails 4 and below, this will use WEBrick as the web
server. In Rails 5 and above, the default is
[puma](http://guides.rubyonrails.org/getting_started.html#starting-up-the-web-server).

You may want to use a different web server in production. See the [Cloud Foundry documentation on configuring a production server](https://docs.cloudfoundry.org/buildpacks/prod-server.html) for more information.


### Troubleshooting asset precompilation

By default, the Rails buildpack performs asset precompilation during the staging phase. This is fine for
most Rails apps, but it will not work for those which need to connect to services (such as the database)
during asset compilation. (For an example, see [MyUSA issue #636](https://github.com/18F/myusa/issues/636))

There are multiple potential solutions for this. Refer to the
[Cloud Foundry documentation on asset precompilation](https://docs.cloudfoundry.org/buildpacks/ruby/ruby-tips.html#precompile) for more information.
