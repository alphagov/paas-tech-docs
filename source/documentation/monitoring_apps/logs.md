## Logs

Cloud Foundry and apps running on Cloud Foundry can generate logs. If your app is failing to deploy, or crashing, and it's not clear why from the command line client messages, you should consult the logs.

For log messages to be captured by Cloud Foundry, your application should be writing them to `STDOUT`/`STDERR`, rather than a log file.

The most direct way to view events related to your application through the deploy process is:

```bash
cf logs APPNAME
```

Used alone, `cf logs` will tail the combined stream of logs from each Cloud Foundry service involved in your application deploy. Running with the `--recent` flag will output the entire [Loggregator](https://docs.cloudfoundry.org/loggregator/architecture.html) [external link] buffer for your app.

```bash
cf logs APPNAME --recent
```


### ``cf events`` command

If you are trying to troubleshoot a problem and it's hard to understand what's happening from the logs, you can use the command:

```bash
cf events APPNAME
```

Running ``cf events`` shows you when an app starts, stops, restarts, or crashes (including error codes). The output is often easier to interpret than the output of ``cf logs``.

## Using third-party log management services

The default Cloud Foundry logging system stores a limited amount of logging information for a defined time. You can retain  logging information for a longer period of time by setting up a third-party log management service. Instructions on how to set up a log management service can be found [here](https://docs.cloudfoundry.org/devguide/services/log-management.html) [external link]. The next section details how to set up an example log management service, [Logit.io](https://logit.io/) [external link].

### Set up the Logit.io log management service

These instructions assume that you already have your app set up and running on Cloud Foundry, and have [set up Logit](https://docs.logit.io/) [external link] as your log management service.

#### Initial steps

1. Go to your Logit.io dashboard.
1. Identify the Logit ELK stack you want to use.

#### Configure logstash filters

This will set up logstash to process the Cloud Foundry logs into separate gorouter and application log types. Copy the logstash filter code:


```
filter {
    grok {
        # attempt to parse syslog lines
        match => { "message" => "%{SYSLOG5424PRI}%{NONNEGINT:syslog_ver} +(?:%{TIMESTAMP_ISO8601:syslog_timestamp}|-) +(?:%{HOSTNAME:syslog_host}|-) +(?:%{NOTSPACE:syslog_app}|-) +(?:%{NOTSPACE:syslog_proc}|-) +(?:%{WORD:syslog_msgid}|-) +(?:%{SYSLOG5424SD:syslog_sd}|-|) +%{GREEDYDATA:syslog_msg}" }
        # if successful, save original `@timestamp` and `host` fields created by logstash
        add_field => [ "received_at", "%{@timestamp}" ]
        add_field => [ "received_from", "%{host}" ]
        tag_on_failure => ["_syslogparsefailure"]
    }

    # parse the syslog pri field into severity/facility
    syslog_pri { syslog_pri_field_name => 'syslog5424_pri' }

    # replace @timestamp field with the one from syslog
    date { match => [ "syslog_timestamp", "ISO8601" ] }

    if !("_syslogparsefailure" in [tags]) {
        # if we successfully parsed syslog, replace the message and source_host fields
        mutate {
            replace => [ "source_host", "%{syslog_host}" ]
            replace => [ "message", "%{syslog_msg}" ]
        }
    }

    # Cloud Foundry passes the app name, space and organisation in the syslog_host
    # Filtering them into separate fields makes it easier to query multiple apps in a single Kibana instance
    dissect {
        mapping => { "syslog_host" => "%{[cf][org]}.%{[cf][space]}.%{[cf][app]}" }
        tag_on_failure => ["_sysloghostdissectfailure"]
    }

    # Cloud Foundry gorouter logs
    if [syslog_proc] =~ "RTR" {
        mutate { replace => { "type" => "gorouter" } }
        grok {
            match => { "syslog_msg" => "%{HOSTNAME:[access][host]} - \[%{TIMESTAMP_ISO8601:router_timestamp}\] \"%{WORD:[access][method]} %{NOTSPACE:[access][url]} HTTP/%{NUMBER:[access][http_version]}\" %{NONNEGINT:[access][response_code]:int} %{NONNEGINT:[access][body_received][bytes]:int} %{NONNEGINT:[access][body_sent][bytes]:int} %{QUOTEDSTRING:[access][referrer]} %{QUOTEDSTRING:[access][agent]} \"%{HOSTPORT:[access][remote_ip_and_port]}\" \"%{HOSTPORT:[access][upstream_ip_and_port]}\" %{GREEDYDATA:router_keys}" }
            tag_on_failure => ["_routerparsefailure"]
            add_tag => ["gorouter"]
        }
        # replace @timestamp field with the one from router access log
        date {
            match => [ "router_timestamp", "ISO8601" ]
        }
        kv {
            source => "router_keys"
            target => "router"
            value_split => ":"
            remove_field => "router_keys"
        }
    }

    # Application logs
    if [syslog_proc] =~ "APP" {
        json {
            source => "syslog_msg"
            add_tag => ["app"]
        }
    }

    # User agent parsing
    if [access][agent] {
        useragent {
            source => "[access][agent]"
            target => "[access][user_agent]"
        }
    }
}
```

1. Go back to the dashboard and click the _Settings_ button for the stack you want to use.
1. Click _Logstash Filters_ on the Stack options menu.
1. Replace the code on this page with the copied logstash filter code.
1. Click the _Validate_ button at the bottom of this page.
1. Once the code has been validated, click the _Apply_ button that appears.
1. Go back to the dashboard once the following confirmation message appears: _Filters have been applied to logstash, logstash will be restarted, this may take up to 2 minutes._

#### Configure application

1. Click the _Settings_ button for the stack you want to use.
2. Click _Logstash Inputs_ on the Stack options menu.
3. Note your _Stack Logstash_ endpoint and TCP-SSL port.
4. Create the log drain service in Cloud Foundry:
  ```
  $ cf create-user-provided-service logit-ssl-drain -l syslog-tls://ENDPOINT:PORT
  ```
5. Bind the service to your app:

  ```
  $ cf bind-service YOUR-CF-APP-NAME logit-ssl-drain
  ```
6. Restage your app:
  ```
  $ cf restage YOUR-CF-APP-NAME
  ```
7. Click _Access Kibana_ on the Stack options menu and verify that you can see the logs in Kibana.

Once you have verified that the logs are draining correctly, you have successfully set up a log management service.

#### Security

The default Logit configuration allows anyone on the Internet to send log messages to your ELK stack.

If you want to ensure that only log messages from GOV.UK PaaS can be sent to your ELK stack:
1. Contact GOV.UK PaaS support at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) for a list of syslog drain egress IP addresses.
1. Send these IP addresses to Logit support at [https://logit.io/contact-us](https://logit.io/contact-us) [external link] and ask that only log messages from these addresses be allowed to be sent to your ELK stack.


### More about logs and troubleshooting

For more information about logging and troubleshooting app deployment, see the following sections of the Cloud Foundry documentation:

* [Information about the log format](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html) [external link]
* [Viewing your application's logs](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html#view) [external link]
* [Troubleshooting application deployment and health](https://docs.cloudfoundry.org/devguide/deploy-apps/troubleshoot-app-health.html) [external link]
* [Configuring third-party log management services](https://docs.cloudfoundry.org/devguide/services/log-management-thirdparty-svc.html) [external link]
