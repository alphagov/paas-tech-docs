# Guidance

## Responsibility model

Your responsibilities differ depending on whether you use a [standard buildpack](/#buildpacks), [custom buildpack](/#how-to-use-custom-buildpacks) or [Docker image](/#deploy-a-docker-image-experimental) to deploy your app.

<div class="table-container">
  <table>
    <tbody>
      <tr>
        <th style="vertical-align: middle; text-align: left">Responsibility</th>
        <th style="vertical-align: middle; text-align: center">Standard Buildpack</th>
        <th style="vertical-align: middle; text-align: center">Custom Buildpack</th>
        <th style="vertical-align: middle; text-align: center">Docker Images</th>
      </tr>
      <tr>
        <td style="vertical-align: middle; text-align: left">
          Your app
          <br> - apply security updates to app dependencies
          <br> - run <a href="https://docs.cloud.service.gov.uk/#penetration-testing">pen tests</a>
        </td>
        <td style="vertical-align: middle; text-align: center; background-color: #ffbf47">Yours</td>
        <td style="vertical-align: middle; text-align: center; background-color: #ffbf47">Yours</td>
        <td style="vertical-align: middle; text-align: center; background-color: #ffbf47">Yours</td>
      </tr>
      <tr>
        <td style="vertical-align: middle; text-align: left">
          Language / runtime
          <br> - update language and runtime
          <br> - provide consistent app build process
          <br> - monitor and patch runtime vulnerabilities
        </td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #ffbf47">Yours</td>
        <td style="vertical-align: middle; text-align: center; background-color: #ffbf47">Yours</td>
      </tr>
      <tr>
        <td style="vertical-align: middle; text-align: left">
          Base operating system
          <br> - update OS libraries
        </td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #ffbf47">Yours</td>
      </tr>
      <tr>
        <td style="vertical-align: middle; text-align: left">
          App admin
          <br> - ensure app instances are up and running
          <br> - ensure provisioning capacity
          <br> - stream application logs
        </td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
      </tr>
      <tr>
        <td style="vertical-align: middle; text-align: left">
          <a href="https://docs.cloud.service.gov.uk/#deploy-a-backing-or-routing-service">Backing services</a>
          <br> - maintain service availability
          <br> - apply security patches
        </td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
      </tr>
      <tr>
        <td style="vertical-align: middle; text-align: left">
          Physical hardware
          <br>- resolve hardware failures
          <br>- encrypt network data traffic
        </td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
        <td style="vertical-align: middle; text-align: center; background-color: #2b8cc4">PaaS</td>
      </tr>
    </tbody>
  </table>
</div>

### Standard buildpacks

You are only responsible for the app code and its dependencies. This includes [penetration testing](https://docs.cloud.service.gov.uk/#penetration-testing) your app.

If you're relatively new to cloud or have a small development team, we recommend using the standard buildpacks to maximise the support you will receive from GOV.UK PaaS.

### Custom buildpacks

You are responsible for managing this custom buildpack's language and runtime, as well as the app code and its dependencies. This applies both in setting up the app, and running it in production.

When setting up the app:

- Do your own due diligence on finding a maintained and supported custom buildpack so that you have a community to call upon in the case of problems
- Test deploy with the buildpack early in your build process, not just before go-live

When running the app in production:

- Ensure you have sufficient time to fix issues yourself as using them for deadline-driven development may be risky
- Regularly maintain your buildpack to update your runtime and dependencies as new security vulnerabilities are discovered and fixed
- We may not be able to offer support for P1 or out-of-hours incidents and standard SLAs will not apply

Due to these increased responsibilities, we recommend that, if you must use a custom buildpack, you use a community supported one that is maintained and updated by that community. We do not recommend that you create your own buildpack.

Contact us at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) if you are interested in this feature. If a custom buildpack is requested by multiple tenants, we will look to improve our support in this area.

### Docker images

You are responsible for your Docker container and custom image. Learn about this [experimental feature](https://docs.cloud.service.gov.uk/#deploy-a-docker-image-experimental).


### Custom buildpacks compared to Docker images

Custom buildpacks provide some advantages over choosing a Docker solution:

- they provide a standard way of building and staging apps
- they are not dependent on a Docker registry such as [Docker Hub](https://hub.docker.com/) being available
- there is a large variety of open source buildpacks, meaning your deployment pipeline doesn’t need to include Docker image creation
- buildpacks are designed for 12-factor apps; some Docker images may contain databases or other forms of storage that should be provisioned as an external backing service

Docker images also provide some advantages over custom buildpacks:

- the same image can be run locally on developer machines, or on any Linux-based machine
- exactly the same Docker image can be promoted between environments as an immutable asset, rather than being rebuilt each time (CF support for this is still experimental)
