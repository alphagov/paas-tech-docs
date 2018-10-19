## Using the Travis CI tool

### Assess Travis

Before using the Travis CI tool, you should assess how it encrypts and protects any sensitive information or secrets such as keys, usernames or passwords, and whether it is suitable for your service.

### Prerequisites

Before setting up Travis CI, you must have:

- a [Github](https://github.com/) [external link] account
- admin access to the GitHub repository that hosts your app
- the latest version of [Ruby](https://www.ruby-lang.org/en/downloads/) [external link] installed
- set your app's [`name`](/deploying_apps.html#names-routes-and-domains) in the app's `manifest.yml` file

### Set up account

1. Register for a [Travis account](https://travis-ci.org) [external link].
1. Link your Travis account to your Github repo.
1. Select the repositories you want Travis to manage.

### Set up Travis using the gem

1. Clone the GitHub repository that hosts your app to your local machine and navigate to the repository folder.
1. Run `gem install travis  --no-rdoc --no-ri` to download the gem.
1. Run the following code to set up Travis:

    ```
    travis setup cloudfoundry
    ```

1. Input the following information when asked:
    - [account](/using_ci.html#configure-your-ci-tool-accounts) username and password
    - the [space](/orgs_spaces_users.html#spaces) and [organisation](/orgs_spaces_users.html#organisations) to deploy your app to
    - the API endpoint URL: `https://api.cloud.service.gov.uk` for the Ireland region, or `https://api.london.cloud.service.gov.uk` for the London region

Travis CI encrypts this information into a `.travis.yml` file.

You can now [build and deploy the app](using_ci.html#build-and-deploy-the-app).

### Set up Travis manually

1. Clone the GitHub repository that host your app to your local machine and navigate to the repository folder.
1. Create a `.travis.yml` file.
1. Add the following code to the `.travis.yml` file:

    ```
    deploy:
      edge: true
      provider: cloudfoundry
      username: USERNAME
      api: API_ENDPOINT
      organization: ORGNAME
      space: SPACENAME
    ```
1. Run the following to write your encrypted credentials to the `.travis.yml`:

    ```
    travis encrypt --add deploy.password
    ```

You can now build and deploy the app.

### Build and deploy the app

1. Commit the `travis.yml` to GitHub. Travis CI uses this file to automatically build and deploy your app.
1. View your live app at `https://NAME.cloudapps.digital`, where [`NAME`](/deploying_apps.html#names-routes-and-domains) is the name of your app in the `manifest.yml` file.

For more information on how to use Travis CI, refer to the [Travis CI documentation](https://docs.travis-ci.com) [external link].
