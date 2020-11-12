## Isolation segments

### What isolation segments are

Cells are the underlying servers that build and run your apps.
GOV.UK PaaS schedules your apps on a large number of identical cells.

GOV.UK PaaS has other cells which are slightly different to the regular cells
on which your apps run. These cells are called isolation segments.

You can specify an isolation segments for a space, or for an organisation.

#### Apps within a space

When you specify an isolation segment for a space, all apps in
that space run on the isolation segment's cells, rather than on the normal
cells.

#### Apps within an organisation

When you specify an isolation segment for an organisation, all apps in
that organisation run on the isolation segment's cells, rather than on the
normal cells.

### What isolation segments are available

We currently offer one isolation segment:

* `egress-restricted-1`

#### Egress restricted

When your apps run in an egress restricted isolation segment, they can:

* serve traffic from the internet (if you map a [public route](/deploying_apps.html#names-routes-and-domains))
* serve traffic internally (if you map a [private route](/deploying_apps.html#deploying-private-apps))
* talk to other apps within the platform (if you set up [network policies](/deploying_apps.html#create-a-network-policy))

However, your apps cannot:

* talk to the internet
* make external DNS requests

### How you can use isolation segments

If we have enabled an isolation segment for your organisation, and if you are
an org manager, you can change how your apps are scheduled using the
isolation segment.

For example, the following commands will create a new space and make sure that any app you push within that space will run on a cell with egress
restrictions:

```
cf create-space my-locked-down-space
cf set-space-isolation-segment my-locked-down-space egress-restricted-1
```

Contact us at
[gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk)
if you would like us to enable an isolation segment for your organisation.
