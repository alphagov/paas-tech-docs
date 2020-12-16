## Deploy a rust app

This section explains minimal steps for deploying a basic Rust app. Refer to our [Alphagov CF Rust Buildpack](https://github.com/alphagov/cf-buildpack-rust/blob/master/README.md) for more information.

> If your app requires a [backing service](/deploying_services/#deploy-a-backing-or-routing-service), it must be able to work with one of the services supported by PaaS. Instructions for deploying both backing service and non-backing service apps are given in this section.

These steps assume you have already carried out the setup process explained in the [Get started](/get_started.html#get-started) section.

When you deploy an app, you must select a combination of an organisation and a space. This is called the [**target**](/deploying_apps.html#set-a-target).

We have provided a ``sandbox`` space for you to use for learning about the PaaS. You may want to target the sandbox while you are testing by running:

``cf target -s sandbox``

It's also important to realise that if you deploy an app using the same name and target as an existing app, the original will be replaced. If you are not sure about where to deploy your app, consult the rest of your team.

### Deploying an app

To deploy a Rust app that does not require a backing service:

1. Put the code for your Rust app into a local directory (for example, by checking it out of version control).

1. [Exclude files ignored by Git](/deploying_apps.html#excluding-files).

1. Create a manifest.yml file in the folder where you checked out your app.

        ---
        applications:
        - name: my-rust-app
          memory: 64M
          buildpacks:
          - https://github.com/alphagov/cf-buildpack-rust

    Replace ``my-rust-app`` with a unique name for your app. (You can use ``cf apps`` to see apps which already exist).

    The `memory` line tells the PaaS how much memory to allocate to the app.

    A buildpack provides any framework and runtime support required by an app. In this case, because the app is written in Rust, you use our ``cf-buildpack-rust``.

1. Upload and start the application by running:

    ```
    cf push APPNAME
    ```

    from the directory which contains all the code and configuration files for your app.

    If you do not specify a name for the app after the ``cf push`` command, the name from the manifest file is used.

1. Set any additional [environment variables](/deploying_apps.html#environment-variables) required by your app. For example:

    ```
    cf set-env APPNAME VARIABLE `value`
    ```

    where VARIABLE is a unique name for the variable, and `value` is the value to set.

Your app should now be available at your [app domain](/orgs_spaces_users.html#regions).

For a production app, you should refer to the [documentation on deploying an app to production](/deploying_apps.html#deploy-an-app-to-production).

### Specify a Rust version

You should tell Cloud Foundry which version of Rust your app uses in the Rust buildpack.

By default, your application will be built using the latest stable Rust. Normally, this is pretty safe: New stable Rust releases have excellent backwards compatibility.

But you may wish to use `nightly` Rust or to lock your Rust version to a known-good configuration for more reproducible builds. To specify a specific version of the toolchain, use a [`rust-toolchain`](https://github.com/rust-lang-nursery/rustup.rs#the-toolchain-file) file in the format rustup uses.

Note: if you previously specified a `VERSION` variable in `RustConfig`, that will continue to work, and will override a `rust-toolchain` file.

### Customizing build flags

If you want to change the cargo build command, you can set the `RUST_CARGO_BUILD_FLAGS` variable inside the `RustConfig` file.

```sh
RUST_CARGO_BUILD_FLAGS="--release -p some_package --bin some_exe --bin some_bin_2"
```

The default value of `RUST_CARGO_BUILD_FLAGS` is `--release`.
If the variable is not set in `RustConfig`, the default value will be used to build the project.


### Running Diesel migrations during the release phase

This will install the diesel CLI at build time and make it available in your app. Migrations will run whenever a new version of your app is released. Add the following line to your `RustConfig`

```sh
RUST_INSTALL_DIESEL=1
```

and this one to your `Procfile`

```Procfile
release: ./target/release/diesel migration run
```
