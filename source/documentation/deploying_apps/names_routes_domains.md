## Names, routes and domains

### App names and cloudapps.digital hostname clash

When you push an app, you have to assign an app name, either in the manifest or using the command line. The app name is also used as the default hostname of the [app domain](orgs_spaces_users.html#regions) where the app will be hosted.

For example, if you push an app called ``myapp``in the London region, the PaaS tries to host it at `myapp.london.cloudapps.digital`. This is done using Cloud Foundry's **route** functions.

The [app domain](/orgs_spaces_users.html#regions) is shared across all PaaS tenants within a region. in this example, if another tenant is using ``myapp.cloudapps.digital`` in the Ireland region, and you try to push an app called ``myapp`` to the same region, you will receive an error like this:

```
Using route myapp.london.cloudapps.digital
Binding myapp.london.cloudapps.digital to myapp...
FAILED
The route myapp.london.cloudapps.digital is already in use.
```


This will also happen if there is an app with the same name within your own organisation, but in a different space.

There are a few possible solutions to this problem:

1.  Minimise the chance of name clash by the way you name your apps; incorporate the name of your team, department or service to produce names that are unlikely to clash with other PaaS tenants. For example, if you work for the Ministry of Peace, instead of ``myapp``, you could use ``minipeace-myapp``.

    If you run different versions of an app in different spaces, you will also need to name them differently: for example, you might have ``minipeace-myapp-dev``, ``minipeace-myapp-test``, ``minipeace-myapp-production`` and so on.

2. Manually specify a hostname that is different from the app name. You can do this as a command line option when you push:

    ``cf push myapp -n HOSTNAME``

    or with a line in the app's ``manifest.yml`` file:


        ---
            ...
            host: HOSTNAME

    You will still need to pick a hostname that is not in use.

    This solution means you can change the hostname while keeping the app name the same. This is more flexible, but means you need to keep track of both a hostname and an app name for each app. It could potentially make it easier to deploy to the wrong target.

3. Use the ``random-route`` option. This appends a couple of random words to the hostname, to avoid clashes. For example, if your app is hosted in the London region and you run:

    ``cf push myapp --random-route``

    the app will be hosted at something like ``https://myapp-mummifying-giraffe.london.cloudapps.digital``.

    You can also specify this in your app's ``manifest.yml`` file:

    ``random-route: true``

    This is a convenient way to avoid clashes automatically. The disadvantage is that if your end users can see the resulting URLs, they may find the random words strange.

### Custom domains

In production, you will probably want your app to be available through your own url (for example, ``yourapp.service.gov.uk``). Go to [using a custom domain](deploying_services/use_a_custom_domain/#set-up-a-custom-domain-using-the-cdn-route-service) to see how to set this up.
