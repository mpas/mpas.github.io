+++
title = "Simple Helloworld verticle"
tags = ["java", "vertx"]
date = "2013-05-16"
+++
Sourcecode:

```java
package helloworld;

import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.deploy.Verticle;

public class Server extends Verticle {

    public void start() {
        vertx.createHttpServer().requestHandler(new Handler<HttpServerRequest>() {
            public void handle(HttpServerRequest req) {
            req.response.headers().put("Content-Type", "text/html; charset-UTF-8");
            req.response.end("<html><body><h1>Hello from vert.x!</h1></body></html>");
            }
        }).listen(8080);
    }

}
```
