## EOF errors due to IP restrictions

We restrict which IP addresses are allowed to access the PaaS through the command line client.

If you have set up the command line client as explained in the [Quick Setup Guide section](/getting_started/quick_setup_guide/#setting-up-the-command-line), and you find that any commands you try are met with an EOF error similar to this:

```
FAILED
Error performing request: Get https://api.cloud.service.gov.uk/v2/info: EOF
```

the most likely reason is that your IP address is not on our 'whitelist' of allowed addresses.

You can [view the list of allowed IPs](https://github.com/alphagov/paas-cf/blob/master/terraform/prod.tfvars#L9) to check if yours is whitelisted. If not, please email us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

Note that the whitelist only limits use of the command line client; it does not restrict access to deployed apps, which are available to everyone.