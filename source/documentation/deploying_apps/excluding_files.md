Cloud Foundry isn't version-control-aware, so `cf push` will deploy the working state of whatever files you have in that directory. In most cases, you will want to [exclude files](http://docs.cloudfoundry.org/devguide/deploy-apps/prepare-to-deploy.html#exclude) [external link] ignored by Git. From within your project directory, run

``
ln -s .gitignore .cfignore
``

and commit the `.cfignore` to your repository. However, read on if you have a more advanced CF setup.

A couple of important points on the `.cfignore`:

1. if you have a more advanced app setup and have apps with a `path` other than the project root (where you run `cf push` from), you will need an additional `.cfignore` file located in each app `path`;

2. also note that more advanced `.gitignore` syntax, such as the `**` recursive subdirectory wildcard, are _not_ supported by `.cfignore`.