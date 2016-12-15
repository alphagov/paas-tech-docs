## Getting an account

Government PaaS is currently in private beta.

If your organisation is taking part in the private beta and you need an account, or you'd like to find about taking part in the beta, please contact us by emailing [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk).

We currently restrict which IP addresses are allowed to access the PaaS to deploy and manage apps. As part of the setup process, you will need to provide us with a list of all the IPs you and your developers will use to access the PaaS. You can [check our whitelist of allowed IPs here](https://github.com/alphagov/paas-cf/blob/master/terraform/prod.tfvars#L9).

In order to provide you with an account, we need to store some personal data about you. Please see [our Privacy Policy](/getting_started/privacy) for details.

## Setting up the command line

Government PaaS uses a hosting technology called Cloud Foundry. As a tenant (that is, someone who is hosting an application on the PaaS), you will use the Cloud Foundry command line client to interact with the PaaS. To set it up:

1. Download and install the <a href="https://github.com/cloudfoundry/cli#downloads" target="blank">Cloud Foundry CLI for your platform </a> [external page, opens in new tab]
    
     *Note:* On macOS Sierra, installing with Homebrew does not work. We recommend using the Mac binary or installer.

2. To check that it installed correctly, go to the Terminal/command line/Command Prompt and run:

    ```
    cf -v
    ```

    You should get a message like this, confirming the version that's installed:

    ```
    cf version X.X.X...
    ```

    *Note:* depending on your network configuration you might need to [set an ```HTTP_PROXY``` environment variable](https://docs.cloudfoundry.org/cf-cli/http-proxy.html) [external link] for the CLI to connect. Contact your network administrators to work out the correct settings for your configuration.  

3. Log in by running:

    ```
    cf login -a api.cloud.service.gov.uk -u USERNAME
    ```

    Your `USERNAME` is your email address your account was created with.

    You will then be prompted to enter your password, which should have been sent to you by email (subject "Welcome to the Government PaaS").

    If your login fails with a message like this:

    ```
    FAILED
    Error performing request: Get https://api.cloud.service.gov.uk/v2/info: EOF
    ```

    and your internet connection is otherwise working, the most likely cause is that your IP address is not on [our whitelist](https://github.com/alphagov/paas-cf/blob/master/terraform/prod.tfvars#L9). Please contact support and ask to be whitelisted.

4. **It's important for security that you now change your password**. Run:

     ``cf passwd``

    You will be prompted to enter your password from the previous step. You can then choose a new password.

Once logged in, you can see the available commands by running ```cf```.


## Deploying a test app

To practice deploying an app, try following the [deploying a static site](/deploying_apps/deploying_static_sites/) process.




