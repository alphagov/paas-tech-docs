## Connecting with SSH

When you deploy an app to GOV.UK PaaS, it runs in a container, which is like a lightweight Linux virtual machine. Each app runs in its own isolated container.

Sometimes, it can be useful to connect directly to the container with SSH. You would usually only do this to get information for troubleshooting purposes, for example, if you can't work out what is happening with your app using the `cf logs` and `cf events` commands described in the [Logs](/#troubleshooting) section. 

If you do run commands which will change the container temporarily, it's a good idea to restart the app afterwards.  

SSH is enabled by default. In most cases, you will find that you can SSH directly to your app's container.

1. Run:

    ```
    cf ssh APPNAME
    ```

    where `APPNAME` is the name of the app. 

2. For some tasks to work, you need to set up the interactive SSH session to match the buildpack environment. To do this, run:

    ```
    export HOME=/home/vcap/app
    [ -d ~/.profile.d ] && for f in ~/.profile.d/*; do source $f; done
    source /home/vcap/app/.profile
    ```

    You need to run this every time you start an SSH session.

    For more information, see the Cloud Foundry documentation on [SSH Session Environment](https://docs.cloudfoundry.org/devguide/deploy-apps/ssh-apps.html#ssh-env) [external link].

3. When you're finished using SSH, use `exit` to end the session.

If you get an error like this:

```
FAILED
Error opening SSH connection: ssh: handshake failed: ssh: unable to authenticate, attempted methods [none password], no supported methods remain
```

go to the section below on [Enabling SSH for an app](#enabling-ssh-for-an-app).

Note that you do not need to generate any SSH keys. The `cf` CLI tool handles authentication for you.

### Connecting with multiple instances

You may be running multiple instances of an app (created using `cf scale` or ``instances:`` in the manifest).

In this situation, each instance has a numerical instance index to distinguish it. You can see this in this example of the output of ``cf app exampleapp``:

```
requested state: started
instances: 3/3
usage: 64M x 3 instances
urls: exampleapp.cloudapps.digital
last uploaded: Wed Dec 21 13:56:24 UTC 2016
stack: cflinuxfs2
buildpack: staticfile_buildpack

     state     since                    cpu    memory        disk         details
#0   running   2016-12-21 02:27:11 PM   3.0%   7.1M of 64M   6.8M of 1G
#1   running   2016-12-21 02:44:46 PM   1.0%   3.5M of 64M   6.8M of 1G
#2   running   2016-12-21 02:44:46 PM   1.0%   3.5M of 64M   6.8M of 1G
```

There are 3 instances, with instance indexes from 0 to 2.

If you have multiple instances like this and use `cf-ssh`, you will be connected to the app with an instance index of 0. 

You can connect to a particular instance. For example, if you want to connect to instance 2, you can do this:

```
cf ssh --app-instance-index 2
```



### SSH permissions

SSH can be either enabled or disabled independently for each **space** and **app**. 

SSH must be enabled for *both* the space *and* the app before it will work. For example, if you have an app where SSH is enabled, but it is deployed to a space where SSH is disabled, SSH won't work.

All new apps and spaces start out with SSH enabled. 

### Enabling SSH for an app

If you unexpectedly find that you can't SSH to an app, the most likely cause is that SSH access is disabled for that app. This may be the case if your app was deployed before we enabled SSH access for tenants (prior to around 1600 GMT on 1st December 2016).

To check if SSH is enabled for an app, run:

```
cf ssh-enabled APPNAME
```

where `APPNAME` is the name of the app.

If you get a message like:

```
ssh support is disabled for APPNAME
```

you need to enable SSH for the app by running:

```
cf enable-ssh APPNAME
```

If you are running multiple instances of an app (created with `cf scale` or with ``instances:`` in the manifest), the ``enable-ssh`` command will affect all of them.

You do not need a special account permission level to enable SSH for an app. The default `SpaceDeveloper` role allows you to do this.

If SSH is already enabled, or enabling it still doesn't make SSH work, go to [Enabling SSH for a space](#enabling-ssh-for-a-space) below.


### Enabling SSH for a space

If enabling SSH for an app doesn't let you connect, check that SSH is enabled for the space it's deployed in.

Check what space you're working in with:

```
cf target
```

Then run:

```
cf space-ssh-allowed SPACENAME
```

where SPACENAME is the name of the space.

If you get a message like this:

```
ssh support is disabled in space 'sandbox'
```

you need to enable SSH for the space using:

```
cf allow-space-ssh SPACENAME
```

Your GOV.UK PaaS account needs the ``OrgManager`` or ``SpaceManager`` role to be able to enable SSH for a space. If the command above fails, ask someone with the correct role (probably a senior member of your team) to run it for you, or contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).


### Limiting SSH access

You should consider disabling SSH where it is not needed. For example, if you host the live versions of your apps in a ``production`` space, you may decide to disable SSH access there, but leave it enabled in your ``development`` and ``testing`` spaces.

### More about SSH

See the Cloud Foundry documentation on [Accessing Apps with SSH](https://docs.cloudfoundry.org/devguide/deploy-apps/ssh-apps.html) [external link].
