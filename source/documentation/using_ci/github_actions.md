## Push an app with GitHub Actions


### Set up dedicated accounts

CI systems should not use normal user accounts. Find out more about [configuring your CI tool accounts](/using_ci.html#configure-your-ci-tool-accounts) in GOV.UK PaaS.

### Store credentials in GitHub Actions

You should [store your sensitive credentials in GitHub Actions](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

Store the username as `CF_USERNAME` and the password as `CF_PASSWORD`.

### Implement a GitHub Actions workflow

Create a `deploy.yml` file in the `.github/workflows` within your repository. The [workflow file](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file) tells GitHub Actions how to deploy your application.

<pre class="highlight plaintext">
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    env:
      CF_API: "https://api.london.cloud.service.gov.uk"
      CF_ORG: "ORG_NAME"
      CF_SPACE: "SPACE_NAME"

    permissions:
      contents: read

    steps:
      - name: Checkout Code
        uses: actions/checkout@ec3a7ce113134d7a93b817d10a8272cb61118579

      - name: Install the CF CLI
        run: |
          wget -O cf.tar.gz "https://packages.cloudfoundry.org/stable?release=linux64-binary&version=7.4.0&source=github-rel"
          tar xzf cf.tar.gz
          sudo mv cf /usr/local/bin/cf

      - name: Authenticate
        env:
          CF_USERNAME: ${{ secrets.CF_USERNAME }}
          CF_PASSWORD: ${{ secrets.CF_PASSWORD }}
        run: |
          echo "Logging into $CF_ORG/$CF_SPACE..."
          cf api "${CF_API}"
          cf auth
          cf target -o "${CF_ORG}" -s "${CF_SPACE}"

      - name: Deploy to PaaS
        run: |
          cf push -f manifest.yml --strategy rolling
          cf logout
</pre>

Where `ORG_NAME` is the name of your org and `SPACE_NAME` is the name of your space.

This section in the file above is instructing GitHub Actions to run the workflow on pushes to the `main` branch.

```
on:
  push:
    branches:
      - main
```

The step `Install CF CLI` installs the Cloud Foundry CLI as the runner environments do not have it by default.

In the step `Authenticate` you should use CF Auth to avoid the use of plain text credentials.

The `Deploy to PaaS` step pushes the application defined in the `manifest.yml` file to Cloud Foundry to the org defined in `CF_ORG` and the space defined in `CF_SPACE`.

The `--strategy rolling` option performs a [rolling deployment](https://docs.cloudfoundry.org/devguide/deploy-apps/rolling-deploy.html) to avoid downtime.
