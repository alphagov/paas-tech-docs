## Upgrading from cflinuxfs2

When you run an app on the PaaS using a buildpack, it runs on top of a version of Ubuntu Linux. We are upgrading the version of Ubuntu used from Ubuntu Trusty to Ubuntu Bionic. In Cloud Foundry, this takes the form of upgrading the stack your apps use from `cflinuxfs2` to `cflinuxfs3`.

Ubuntu Trusty is no longer getting security updates and to ensure the security of the platform we will need to forcibly upgrade all apps. It is possible that this will break your application. You can prevent this happening by manually upgrading.

To check if you are affected by this change, sign in to your GOV.UK PaaS admin tool for [Ireland](https://admin.cloud.service.gov.uk) or [London](https://admin.london.cloud.service.gov.uk). Select each of your organisations. If you are affected then the interface will warn you and list the affected apps.

Newly created apps will automatically be on `cflinuxfs3` unless you have specified `cflinuxfs2`.

### To see what stack your app is using

If you look at your apps in your admin panel for [Ireland](https://admin.cloud.service.gov.uk) or [London](https://admin.london.cloud.service.gov.uk), it will tell you the stack and whether you need to upgrade.

From the command line, run `cf app NAME_OF_YOUR_APP` and check what it says the `stack:` is.

### To upgrade from cflinuxfs2 to cflinuxfs3

How you manually upgrade from cflinuxfs2 depends on how you deploy your app. You can:

* Add `stack: cflinuxfs3` to the `manifest.yml` of your app, and then redeploy that app;
* Deploy a new app which will automatically use `cflinuxfs3`;
* Specify the `-s cflinuxfs3` argument when running `cf push` on your app.

Contact us by emailing gov-uk-paas-support@digital.cabinet-office.gov.uk if you have any questions.
