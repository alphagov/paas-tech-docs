## Organisations, spaces & targets

### Organisations

Your tenant account belongs to at least one **organisation** ("org" for short) within the PaaS. This typically represents the real-world organisation, department or team you work for. Your co-workers' tenant accounts will belong to the same org. 

Typically a team has a single organisation, but you can have more than one.

To list the orgs your account can access, run:

``cf orgs``

To see details about an org, run:

``cf org ORGNAME``

where ORGNAME is the name of the org.

### Spaces

Each organisation is divided into one or more **spaces**, which are used to organise app development, deployment, and maintenance. For example, you might have spaces for development and production versions of your app.

![Diagram showing that an organisation contains multiple spaces](/documentation/figures/org-spaces.png)

Different accounts can have different permissions to access each space, which are granted through user roles. For example, you may choose to give a junior developer access to your ``development`` space, but not to ``production``. To change which accounts have access, your account needs to have the Org Manager role. See the section on [Managing users](/#managing-users) for more about roles.

When we set up your organisation, we create a default `sandbox` space you can use for experimenting with the PaaS.


To see the spaces you can access in your current org, run:

``cf spaces``

### Setting a target

To deploy an app, you need to specify a combination of an organisation and a space: this is called the **target**.

Set the target with:

``cf target -o ORGNAME -s SPACENAME``

Once you set the target, the Cloud Foundry client remembers it until you change it.

You can change space without changing org using:

``cf target -s SPACENAME``

You should target the sandbox space while you are testing your app. You can do this by running:

``cf target -s sandbox``

You will not normally need to target the sandbox space if you are a new user, as this space is the default for new users. A possible exception to this is if your organisation is mature and has pre-existing spaces; you should check to ensure that you target the appropriate space for testing.


### Managing spaces

You can create new spaces within an org if your account has the [Org Manager](/#org-manager) role. To find out who has that role, run:

``cf org-users ORGNAME``

where `ORGNAME` is the name of the org. You will see a list of users and their roles.

If your account does not have the Org Manager role and you need to create a new space, you should ask a co-worker who is an Org Manager for your organisation.

As an Org Manager, you can use:

``cf create-space SPACENAME -o ORGNAME`` 

to create a new space. You will then need to grant access to any tenant accounts who should be able to use that space.

### Granting access

You grant access to a space by assigning a role to an account. To assign roles, you need to be an [Org Manager](/#org-manager) or [Space Manager](/#space-manager).

In most cases, the role you will assign is [Space Developer](/#space-developer), which gives the account an ability to deploy and manage apps in the specified space.

To grant access to a space to another account, run:

``cf set-space-role USERNAME ORGNAME SPACENAME ROLE``

The ``USERNAME`` is the email address the user logs in with when using the command line client.

For example, say you had just created a space called ``test`` within your org called ``acme``, and you wanted your co-worker ``ana@example.com`` to be able to use that space as a developer, you would run:

``cf set-space-role ana@example.com acme test SpaceDeveloper``


### Learning more

See the Cloud Foundry documentation on [Orgs, Spaces, Roles, and Permissions](https://docs.cloudfoundry.org/concepts/roles.html) [external link] for more details.
