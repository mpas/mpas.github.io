+++
date = "2015-06-05"
tags = ["docker"]
title = "Installing Docker Registry 2.0.1 using self signed certificates"
+++
The new Docker Registry (2.x) has just been released and is rewritten in Go. The default installation now requires SSL security and I was looking for a way to secure the Registry using a NGINX SSL proxy where users need to provide username/password to access the registry. The setup of the NGINX proxy can be done manually but i decided to see if i can reuse the excellent images from Container Solutions to ease the installation.

So the setup will be that we install the Docker Registry and proxy the SSL user access via self signed certificates using an NGINX proxy image provided by Container Solutions. [Check here for more information](http://container-solutions.com/2015/04/running-secured-docker-registry-2-0/)

Installation of the remote docker registry will be done by using on an Amazon EC2 (Linux AMI). Currently the free tier Amazon Linux AMI 2015.03 (HVM), SSD Volume Type - ami-a10897d6. So spin up the Amazon AMI and let's install Docker.

**Note:** when you spin up your Amazon AMI make sure to remember the FQDN/DNS name! We need this name to generate the SSL certificates!

	Example:
	<domain-name> = ec2-52-16-247-220.eu-west-1.compute.amazonaws.com

So spin up your AMI and install Docker!

## Installing docker
- login into your Amazon AMI
- update the system and install Docker

```console
$ sudo yum update -y
$ sudo wget -qO- https://get.docker.com/ | sh
```

-  add the ec2-user to the `docker` group (optional)
```console
$ sudo usermod -aG docker ec2-user
```

- start Docker
```console
$ sudo service docker start
```

- make sure Docker can run the basic "hello-world"

```console
$ sudo docker run hello-world
```        

## Create Docker Registry data and configuration directories
We are going to store the registry image data inside `/opt/docker/registry/data` and configuration files such as the ssl certificates and user login inside `/opt/docker/registry/conf`.

- create data folders for Docker Registry data and configuration

```console
$ sudo mkdir -p /opt/docker/registry/data
$ sudo mkdir -p /opt/docker/registry/conf
```

## Run the Docker Registry
Now we are able to run the Docker Registry, the data for images that will be pushed are going to be stored in `/opt/docker/registry/data` and the container will be named `docker-registry`

- run the registry and name it `docker-registry`

```console
$ sudo docker run -d -v /opt/docker/registry/data:/tmp/registry-dev \
--name docker-registry registry:2.0.1
```

- test if the registry is actually running

```console
$ sudo docker ps
```
**So now we have a running Docker Registry, but still no SSL proxy and no user accounts to get access to the registry.**

## Generate self signed certificates for our SSL proxy
The result of the certificate generation will be placed in `/opt/docker/registry/conf` and named `docker-registry.crt` and `docker-registry.key`.

**Note:** The `docker-registry.crt` file is important, we will need this later on to configure our local Docker client on the machine that is going to access the remote registry. So after generating the `docker-registry.crt` file, grab this and store it on your local machine in a place where you can find it.

- generate the certificates

```console
$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /opt/docker/registry/conf/docker-registry.key \
-out /opt/docker/registry/conf/docker-registry.crt
```

Accept all defaults and make sure you give the correct FQDN /DNS name = `<domain-name>`.

## Create passwords for access to the Docker Registry
In order to let users login into the registry we need to create users  (user1/user2). This will be done by using `htpasswd`. The user data will be stored in `docker-registry.htpasswd` file and placed in the `/opt/docker/registry/conf` directory.

- install htpasswd

```console
$ sudo yum install httpd-tools -y
```

- create the users

```console
$ sudo htpasswd -c /opt/docker/registry/conf/docker-registry.htpasswd user1
$ sudo htpasswd /opt/docker/registry/conf/docker-registry.htpasswd user2
```

**Note:** when creating the second user omit the `-c` otherwise the docker-registry.htpasswd file will be get overwritten!

## Run the NGINX Proxy
As mentioned we are going to use the image from [Container Solutions](http://container-solutions.com/2015/04/running-secured-docker-registry-2-0/) to run our NGINX proxy.

- start the NGINX proxy and name it `docker-registry-proxy`

```console
$ sudo docker run -d -p 443:443  \
-e REGISTRY_HOST="docker-registry" -e REGISTRY_PORT="5000" -e SERVER_NAME="localhost" \
--link docker-registry:docker-registry \
-v /opt/docker/registry/conf/docker-registry.htpasswd:/etc/nginx/.htpasswd:ro \
-v /opt/docker/registry/conf:/etc/nginx/ssl:ro \
--name docker-registry-proxy containersol/docker-registry-proxy
```

After this step we have a running Docker Registry which is secured using Self Signed certificates and users are able to login using their username/password.

To test this navigate to your registry by using a browser (Chrome) and access: `https://<domain-name>:443/v2/`. After accepting the security warning provide a username/password and the output should be `{}`.

## Configure the local Docker client
Now that we have a running secured Docker Registry we can configure the Docker client on our machine that is going to access the remote Registry. For this we need a copy of the earlier `docker-registry.crt` file.

- copy the `docker-registry.crt` file from our server to your local machine. This file is located in `/opt/docker/registry/conf`. Put the copy in a place where you can find it.

### Ubuntu Docker Client
In order to get the local client working, we need to install Docker and register the `docker-registry.crt` certificate file!

- install docker

```console
$ sudo wget -qO- https://get.docker.com/ | sh
$ sudo service docker start
```

- create a directory holding our extra certificates

```console
$ sudo mkdir /usr/share/ca-certificates/extra
```

- copy the `docker-registry.crt` file to the directory `/usr/share/ca-certificates/extra`

- register the certificate

```console
$ sudo dpkg-reconfigure ca-certificates
```

Now you are almost ready!

- restart the local Docker client

```console
$ sudo service docker restart
```

- login onto your remote registry using

```console
$ docker login <domain-name>:port
```

Now we have a remote Docker Registry and the Docker Client is able to connect!
