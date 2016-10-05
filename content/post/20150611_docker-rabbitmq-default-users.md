+++
date = "2015-06-11"
tags = ["docker", "rabbitmq"]
title = "Setting up Docker RabbitMQ with predefined users/vhosts"
+++

When creating an Docker image it is nice to have predefined users and vhosts without manually having to create them after the Docker RabbitMQ image has started.

The following is a Dockerfile that extends the default Docker RabbitMQ image including the Management Plugin and it creates a standard set of users / vhosts when the container is created from the image.

It involves a init.sh script that is used to create the users and vhosts.

The Docker File
```docker
FROM rabbitmq:3-management

# Add script to create default users / vhosts
ADD init.sh /init.sh

# Set correct executable permissions
RUN chmod +x /init.sh

# Define default command
CMD [&quot;/init.sh&quot;]
```

The init.sh script
```bash
#!/bin/sh

# Create Default RabbitMQ setup
( sleep 10 ; \

# Create users
# rabbitmqctl add_user <username> <password>
rabbitmqctl add_user test_user test_user ; \

# Set user rights
# rabbitmqctl set_user_tags <username> <tag>
rabbitmqctl set_user_tags test_user administrator ; \

# Create vhosts
# rabbitmqctl add_vhost <vhostname>
rabbitmqctl add_vhost dummy ; \

# Set vhost permissions
# rabbitmqctl set_permissions -p <vhostname> <username> ".*" ".*" ".*"
rabbitmqctl set_permissions -p dummy test_user ".*" ".*" ".*" ; \
) &    
rabbitmq-server $@
```
Place both of these files in a directory and build your image:

```console
$ docker build -t my_rabbitmq_image .
```

Start a container based on the image using:

```groovy
$ docker run --rm=true --name my_rabbitmq_container -p 5672:5672 -p 15672:15672  my_rabbitmq_image
```

Then in your browser navigate to http://localhost:15672 and see if all is ok!

**Note:** When using Boot2Docker make sure to replace the localhost with the correct IP.
