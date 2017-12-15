## Use Travis

*As at April 2017, Cloudfoundry support is currently included in the latest 'edge' version of Travis, which means it will work with GOV.UK PaaS. We expect it will become part of the core product soon. Likewise, our support for this is also new, so please contact our support team with any problems so we can continue to improve our documentation.*

In order to do this, you will need to register for a Travis account. If you link this to your GitHub account, it will be able to see all your personal code repositories as well as those of the GitHub organisations you belong to.

Use the switch icons allow you to turn on the repos Travis will manage - remember that you'll need administrator access on any shared repos. This helps stop you deploying any code you shouldn't!

You will need to know the the particular PaaS `organisation` and `space` you want Travis to deploy your app into. If you don't know, you can get these by logging into PaaS with a terminal window and using the `cf orgs` and `cf spaces` commands.

If you haven't already done so, we also strongly recommend that you add a `name` entry to your `manifest.yml` file so that you'll know the address of your app once published. [Find out about names and URLs on PaaS](#names-routes-and-domains).

### Plan for dedicated CI accounts

Note that using your own PaaS login details within a CI service should only be a temporary measure. Dedicated user accounts should be set up for testing as soon as reasonably possible - by the end of Alpha at the latest. If you are already an `Org Manager` role on another project in Beta or Live, you should do this anyway. Find out more about [credentials for automated accounts](#credentials-for-automated-accounts).

### Download the Travis gem

Make sure you use at least ruby 1.9.3 and download the gem:

```
gem install travis  --no-rdoc --no-ri
```

### Automatic setup (recommended for new users)

Run the setup to configure it to work with Cloudfoundry. It will ask for a username and password it can use to login to PaaS, the space and organisation you wish to deploy to, and the API URL. It will encrypt the data for you in `.travis.yml` file.

```
travis setup cloudfoundry
```

### Manual setup

Create `.travis.yml` and put Cloudfoundry configuration in it. If you already have a `.travis.yml` file please add the appropriate lines:

```
deploy:
  edge: true
  provider: cloudfoundry
  username: tests@example.com
  api: https://api.cloud.service.gov.uk
  organization: mydepartament
  space: ci
```

Now you can add encrypted credentials to `.travis.yml` with the following command

```
travis encrypt --add deploy.password
```

### Commit travis.yml to Github

Whichever setup approach you took, now commit your code to GitHub. After a few moments, the new `.travis.yml` file will be detected by Travis CI. If you look on the Travis website, you will see it start to automatically build and deploy your application.

### Go to your application

Once Travis has finished building and deploying, go to the URL you set with the `name` field in your `manifest.yml` - the application should be at `https://[name].cloudapps.digital`.

As you continue to develop your prototypes, you can also ask Travis to start running automated tests for you, or deploy to different environments for each branch. More details can be found in the [Travis documentation](https://docs.travis-ci.com/user/gui-and-headless-browsers/).
