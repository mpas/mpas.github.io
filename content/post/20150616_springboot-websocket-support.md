+++
title = "Adding WebSocket/Stomp support to a Spring Boot application"
date = "2015-06-16"
tags = ["spring-boot", "websocket"]
+++

Adding support for [WebSockets](https://en.wikipedia.org/wiki/WebSocket) / [Stomp](https://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol) in a [Spring Boot](http://projects.spring.io/spring-boot/) application has never been more easy. You can use WebSockets to receive serverside events or push data to the server using WebSockets.

The following example will enable a server to send messages to a WebSocket/Stomp client.

<!--more-->

* Modify `build.gradle`

```groovy
dependencies {
    compile("org.springframework.boot:spring-boot-starter-web")
    compile("org.springframework.boot:spring-boot-starter-websocket")
    compile("org.springframework:spring-messaging")
    testCompile("junit:junit")
}
```

* Create a WebSocket configuration class that holds the configuration

```groovy
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // the endpoint for websocket connections
        registry.addEndpoint("/stomp").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // use the /topic prefix for outgoing WebSocket communication
        config.enableSimpleBroker("/topic");

        // use the /app prefix for others
        config.setApplicationDestinationPrefixes("/app");
    }
}
```

Now a client that connects to `/stomp` endpoint is able to receive WebSocket messages.

* Create a service that is going to send the data to a WebSocket endpoint

```groovy
@Service
public class ScheduleTask {

    @Autowired
    private SimpMessagingTemplate template;

    // this will send a message to an endpoint on which a client can subscribe
    @Scheduled(fixedRate = 5000)
    public void trigger() {
        // sends the message to /topic/message
        this.template.convertAndSend("/topic/message", "Date: " + new Date());
    }

}
```

* Create a client that is able to receive the message

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Stomp Receiving Example</title>
</head>
<body>
    <div>
        <h3>Messages:</h3>
        <ol id="messages"></ol>
    </div>

    <script type="text/javascript" src="//cdn.jsdelivr.net/jquery/1.11.2/jquery.min.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>

    <script type="text/javascript">
        $(document).ready(function() {
            var messageList = $("#messages");

            // defined a connection to a new socket endpoint
            var socket = new SockJS('/stomp');

            var stompClient = Stomp.over(socket);

            stompClient.connect({ }, function(frame) {
                // subscribe to the /topic/message endpoint
                stompClient.subscribe("/topic/message", function(data) {
                    var message = data.body;
                    messageList.append("<li>" + message + "</li>");
                });
            });
        });
    </script>
</body>
</html>
```

The whole example project  can be downloaded [https://github.com/mpas/spring-boot-websocket-stomp-server-send-example](https://github.com/mpas/spring-boot-websocket-stomp-server-send-example)
