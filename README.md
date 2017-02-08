# GOV.UK PaaS Technical Documentation

This is the new technical documentation system for GOV.UK PaaS. 

The official docs to give out to tenants are still those hosted at https://government-paas-developer-docs.readthedocs.io/en/latest/ (powered by readthedocs) - however, that will change very shortly.

The *temporary* URL for the output of the new system is https://paas-tech-docs.cloudapps.digital/ - do not publicise this, link to it, or give it to tenants. The permanent URL will be https://docs.cloud.service.gov.uk and will start working soon.

Do not update the docs content on the old system. Update it here.


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

A new markdown file isn't automatically included in the generated output. If you
add a new markdown file at the location `source/documentation/agile/scrum.md`,
the following snippet in `source/index.html.md.erb` will include it in the
generated output.

```
<%= partial 'documentation/agile/scrum' %>
```

Including files manually like this enables you to specify the position they appear in
the page.

The sections in the documentation are controlled by the use of markdown headers, *not* the file structure.

Avoid editing any of the following:

+ source/images/*
+ source/javascripts/*
+ source/layouts/*
+ source/stylesheets/*
+ source/favicon.ico

as this will make it a lot harder to stay up to date with any changes made to the template.

Images to be included in the docs are kept in `source/documentation/figures`

In order to configure some aspects of layout, like the header, edit ``config/tech-docs.yml``.

## Preview

Whilst writing documentation, you can run a middleman server to preview how the
published version will look in the browser. 

The preview is only available on your own computer. Others won't be able to
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

This repo is configured in Travis to run a link-checker over the generated docs
to find any broken links etc. If you want to run this locally, do the
following:

```
virtualenv .venv
source .venv/bin/activate
pip install -Ur requirements.txt
./script/test
```

## Build and deploy

The docs are hosted on the PaaS.

To deploy your changes:

Make sure you have the correct PaaS permissions to push to the org `govuk-paas` in the space `docs`.

Push your changes to Github (on the main branch). 

Run ``./script/deploy`` from the application folder.

## Updating the template

The master repository for the tech docs template system is at https://github.com/alphagov/tech-docs-template 

See the section "Updating a project to use the latest template" at https://github.com/alphagov/tech-docs-template

The template system is maintained and developed by the service design manual team.  You can contact them at `#tech-docs-format` on GDS Slack. Note that this is an MVP version and there is a roadmap of planned features and improvements.
