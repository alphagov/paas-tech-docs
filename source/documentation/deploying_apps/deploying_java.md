## Deploy a Java app


This section covers how to deploy a Java application to GOV.UK PaaS using the [Java buildpack](https://github.com/cloudfoundry/java-buildpack) [external link]. 


### Deploying a JAR file

If your java application can be packaged as a [self-executable JAR](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/container-java_main.md) [external link] then deployment can be as simple as using `cf push -p [your-app].jar [your-app-name]`.

This example will walk through creating a simple "Hello World" application that embeds the popular ([Jetty](http://www.eclipse.org/jetty/)) [external link] webserver.
The instructions assume you have already carried out the setup process explained in the [Quick Setup Guide](https://docs.cloud.service.gov.uk/#quick-setup-guide) section.

1. Create a directory for your Java application:

    ```bash
    mkdir myapp
    cd myapp
    ```

1. Download Jetty.

    ```bash
    curl -o ./jetty.jar http://central.maven.org/maven2/org/eclipse/jetty/aggregate/jetty-all/9.4.6.v20170531/jetty-all-9.4.6.v20170531-uber.jar
    ```
    This example uses version 9.4.6; check [http://www.eclipse.org/jetty/download.html](http://www.eclipse.org/jetty/download.html) for the latest version of Jetty.
    
1. Create a `App.java` file in your application directory. This class will serve as the entry point for your application:

    ```java
    package app;

    import java.io.IOException;
    import javax.servlet.ServletException;
    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    import org.eclipse.jetty.server.Request;
    import org.eclipse.jetty.server.Server;
    import org.eclipse.jetty.server.handler.AbstractHandler;


    public class App extends AbstractHandler
    {
        @Override
        public void handle( String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response ) throws IOException, ServletException
        {
               response.setContentType("text/html; charset=utf-8");
               response.setStatus(HttpServletResponse.SC_OK);
               response.getWriter().println("<h1>Hello World</h1>");
               baseRequest.setHandled(true);
        }

        public static void main( String[] args ) throws Exception
        {
                int port = Integer.parseInt(System.getenv("PORT"));
                Server server = new Server(port);
                server.setHandler(new App());

                server.start();
                server.join();
        }
    }
    ```
4. Compile your class:

    ```bash
    javac -d . -cp ./jetty.jar App.java
    ```

5. Combine your class with Jetty to create an executable jar file:

    ```bash
    jar uvfe ./jetty.jar app.App app/App.class
    ``` 

6. Push your jar file.

    ```bash
    cf push your-app-name -b java_buildpack -p ./jetty.jar
    ```

You have now deployed your Java application. Your application should now be accessible over HTTPS from the URL provided in the output.

If your application requires arguments in order to start, you can set the `JBP_CONFIG_JAVA_MAIN` environment variable. For example to add `server` and `config.yml` as arguments for your app, you could add the following to your application's `manifest.yml`:

```yaml
env:
  JBP_CONFIG_JAVA_MAIN: '{ arguments: "server config.yml" }
```

### Deploying a WAR file

If your application can be packaged as a `.war` file you can deploy with the following:

```bash
cf push your-app-name -b java_buildpack -p your-app.war
```

If you need to use a specific version of Tomcat you can set the environment variable `JBP_CONFIG_TOMCAT`. For example to use Tomcat 8 you could add the following to your application's `manifest.yml`:

```yaml
env:
  JBP_CONFIG_TOMCAT: '{ tomcat: { version: 8.0.+ } }'
```
Note that you do **not** need to deploy Tomcat along with your application. The Java buildpack will run the servlet 2 and 3 web applications.

For more configuration options see [Tomcat Container](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/container-tomcat.md) [external link].

### Deploying other JVM-based applications

The Java buildpack supports running any JVM-based applications (such as Scala, Clojure etc.) with little or zero additional configuration. For detailed examples of deploying applications using other frameworks and JVM-based languages:

* [Embedded web server](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-embedded-web-server.md) [external link]
* [Grails](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-grails.md) [external link]
* [Groovy](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-groovy.md) [external link]
* [Java Main](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-java_main.md) [external link]
* [Play Framework](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-play_framework.md) [external link]
* [Servlet](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-servlet.md) [external link]
* [Spring Boot CLI](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/example-spring_boot_cli.md) [external link]
* [Cloud Foundry Java Buildpack documentation](https://github.com/cloudfoundry/java-buildpack/blob/master/README.md) [external link]
* [Cloud Foundry tips for java developers](https://docs.cloudfoundry.org/buildpacks/java/java-tips.html) [external link] for more information.


