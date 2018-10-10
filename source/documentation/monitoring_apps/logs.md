## Logs

Cloud Foundry and apps running on Cloud Foundry can generate logs. You should consult your logs if your app is failing to deploy or crashing, and it's not clear why.

For Cloud Foundry to capture your app's logs, your app should write logs to `STDOUT`/`STDERR` instead of a log file.

Run `cf logs` to output all logs from each Cloud Foundry service involved in your app deploy:

```bash
cf logs APP_NAME
```

Run `cf logs` with the `--recent` flag to output the entire [Loggregator](https://docs.cloudfoundry.org/loggregator/architecture.html) [external link] buffer for your app:

```bash
cf logs APP_NAME --recent
```

Run `cf events` to see when an app starts, stops, restarts, or crashes (including error codes):

```bash
cf events APP_NAME
```

## Using commercial log management services

By default, Cloud Foundry streams a limited amount of logs to your terminal for a defined time. You can keep more logging information for longer by setting up a commercial log management service. This section shows how to set up the [Logit.io log management service](https://logit.io/) [external link].

### Set up the Logit.io log management service

#### Pre-requisites

Before setting up Logit, you must:

- [set up your app on Cloud Foundry](https://docs.cloud.service.gov.uk/deploying_apps.html#deploying-apps)
- [sign up to Logit](https://logit.io/) [external link]
- [sign into Cloud Foundry](https://docs.cloud.service.gov.uk/get_started.html#set-up-command-line)

#### Configure logstash filters

You must set up logstash to process the Cloud Foundry logs into separate gorouter and app log types.

1. Go to your Logit dashboard and select __Settings__ for the Logit ELK stack you want to use.
1. Select __Logstash Filters__ on the __Stack options__ menu.
1. Replace the code on the __Logstash Filters__ page with the following logstash filter code:

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

        if !("_syslogparsefailure" in [tags]) {
            # if we successfully parsed syslog, replace the message and source_host fields
            mutate {
                rename => [ "syslog_host", "source_host" ]
                rename => [ "syslog_msg", "message" ]
            }
        }
    }
    ```

1. Select __Validate__.
1. Select __Apply__ once the code is valid.
1. Go back to the Logit dashboard once the following message appears:
“Filters have been applied to logstash, logstash will be restarted, this may take up to 2 minutes”.

#### Configure app

1. Select __Settings__ for the stack you want to use.
1. Select __Logstash Inputs__ on the __Stack options__ menu.
1. Note your __Stack Logstash endpoint__ and __TCP-SSL port__.
1. Run the following in the command line to create the log drain service in Cloud Foundry:

    ```
    $ cf create-user-provided-service logit-ssl-drain -l syslog-tls://ENDPOINT:PORT
    ```

1. Bind the service to your app by running:

    ```
    $ cf bind-service APP_NAME logit-ssl-drain
    ```

1. Restage your app by running:

    ```
    $ cf restage APP_NAME
    ```

1. Select __Access Kibana on the Stack options__ menu and check that you can see the logs in Kibana.

Once you have confirmed that the logs are draining correctly, you have successfully set up Logit.

#### Enable security for your ELK

By default, Logit allows anyone on the Internet to send logs to your ELK stack. You can set up Logit to ensure that your ELK stack only receives logs from GOV.UK PaaS.

1. Contact GOV.UK PaaS support at [gov-uk-paas-support@digital.cabinet-office.gov.uk](mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk) for a list of syslog drain egress IP addresses.
1. Send these IP addresses to Logit support at [https://logit.io/contact-us](https://logit.io/contact-us) [external link] and ask that your ELK stack only receive log messages from these addresses.

#### Further information

Refer to the Cloud Foundry documentation for more information on:

- [streaming application logs to log management services](https://docs.cloudfoundry.org/devguide/services/log-management.html) [external link]
- [configuring other commercial log management services](https://docs.cloudfoundry.org/devguide/services/log-management-thirdparty-svc.html) [external link]
- [the log format](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html) [external link]
- [viewing your application's logs](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html#view) [external link]
- [troubleshooting application deployment and health](https://docs.cloudfoundry.org/devguide/deploy-apps/troubleshoot-app-health.html) [external link]
