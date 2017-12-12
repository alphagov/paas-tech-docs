## Tracing HTTP requests

The Cloud Foundry router automatically adds Zipkin-compatible headers to the incoming HTTP requests so you can match those with your application's responses.

> Zipkin is a tracing system that enables app developers to troubleshoot failures or latency issues. Zipkin provides the ability to trace requests and responses across distributed systems. See [Zipkin.io](https://zipkin.io) [external link] for more information.

To trace app requests and responses in Cloud Foundry, apps must also log Zipkin headers.

After adding Zipkin HTTP headers to app logs, developers can use ```cf logs myapp``` to correlate the trace and span ids logged by the Cloud Foundry router with the trace ids logged by their app. To correlate trace IDs for a request through multiple apps, each app must forward appropriate values for the headers with requests to other applications.
