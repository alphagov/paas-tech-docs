# GOV.UK PaaS Technical Documentation

This is the new technical documentation system for GOV.UK PaaS published at [docs.cloud.service.gov.uk](docs.cloud.service.gov.uk).

Documentation for the technical documentation tool is published at [https://tdt-documentation.london.cloudapps.digital](https://tdt-documentation.london.cloudapps.digital) [external link].

## Getting started

Clone this repository to a folder on your computer.

Install Ruby with Rubygems, preferably with [Ruby version manager](rvm),
and the [Bundler gem](bundler).

In the application folder, type the following to install the required gems:

```
bundle install
```

## Making changes

To make changes, edit the markdown files in the `source` folder.

Although a single page of HTML is generated, the markdown is spread across
multiple files to make it easier to manage. They can be found in
`source/documentation`.

A new markdown file is not automatically included in the generated output. If you
add a new markdown file at the location `source/documentation/agile/scrum.md`,
the following snippet in `source/index.html.md.erb` will include it in the
generated output.

```
<%= partial 'documentation/agile/scrum' %>
```

Including files manually like this enables you to specify the position they appear in
the page.

The sections in the documentation are controlled by the use of markdown headers, *not* the file structure.

Images to be included in the docs are kept in `source/documentation/figures`

In order to configure some aspects of layout, like the header, edit ``config/tech-docs.yml``.

## Preview

Whilst writing documentation, you can run a middleman server to preview how the
published version will look in the browser.

The preview is only available on your own computer. Others will not be able to
access it if they are given the link.

Type the following to start the server:

```
bundle exec middleman server
```

If all goes well something like the following output will be displayed:

```
== The Middleman is loading
== LiveReload accepting connections from ws://192.168.0.8:35729
== View your site at "http://Laptop.local:4567", "http://192.168.0.8:4567"
== Inspect your site configuration at "http://Laptop.local:4567/__middleman", "http://192.168.0.8:4567/__middleman"
```

You should now be able to view a live preview at http://localhost:4567.

Changes to the `tech-docs.yml` file require stopping and restarting the server to show up in the preview. (Stop it with `Ctrl-C`).

## Running tests

This repo is configured in GitHub actions to run a link-checker over the generated docs
to find any broken links and so on. If you want to run this locally, do the
following:

```
virtualenv .venv
source .venv/bin/activate
make dependencies
make test
```

## Build and deploy

The docs are hosted on GitHub Pages which is deployed using GitHub actions. GitHub pages is configured
with a custom sub-domain at [docs.cloud.service.gov.uk](docs.cloud.service.gov.uk).

The deploy process first runs `bundle exec middleman build` which generates a `build` directory consisting of static files for our site. 

Next the [upload-pages-artifact](https://github.com/actions/upload-pages-artifact) action takes the `build` directory and turns it into
 a [gzip archive](https://en.wikipedia.org/wiki/Gzip) called `github-pages` which the [deploy-pages](https://github.com/actions/deploy-pages) action uses to deploy to GitHub pages.

## Updating the template

The master repository for the tech docs template system is at https://github.com/alphagov/tech-docs-template

The template system is maintained and developed by the service design manual team.  You can contact them at `#tech-docs-format` on GDS Slack. Note that this is an MVP version and there is a roadmap of planned features and improvements.

## Licence

Unless stated otherwise, the codebase is released under [the MIT licence](./LICENSE).

The data is [© Crown
copyright](http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/)
and available under the terms of the [Open Government
3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
licence.
