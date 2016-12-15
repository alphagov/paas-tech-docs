
If your app deployment is failing and it's not clear why from the command line client messages, you should consult the logs.

For log messages to be captured by Cloud Foundry, your application should be writing them to `STDOUT`/`STDERR`, rather than a log file.

The most direct way to view events related to your application through the deploy process is:

```bash
cf logs APPNAME
```

Used alone, `cf logs` will tail the combined stream of logs from each Cloud Foundry service involved in your application deploy. Running with the `--recent` flag will stream the entire [Loggregator](https://docs.cloudfoundry.org/loggregator/architecture.html) [external link] buffer for your app.

```bash
cf logs APPNAME --recent
```


## ``cf events`` command

If you are trying to troubleshoot a problem and it's hard to understand what's happening from the logs, you can use the command:

```bash
cf events APPNAME
```

Running ``cf events`` shows you when an app starts, stops, restarts, or crashes (including error codes). The output is often easier to interpret than the output of ``cf logs``.

## Further information

For more information about logging and troubleshooting app deployment, see the following sections of the Cloud Foundry documentation:

* [Information about the log format](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html) [external link]
* [Viewing your application's logs](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html#view) [external link]
* [Troubleshooting application deployment and health](https://docs.cloudfoundry.org/devguide/deploy-apps/troubleshoot-app-health.html) [external link]


