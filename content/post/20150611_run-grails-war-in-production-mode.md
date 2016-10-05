+++
title = "Run a Grails 3 generated Fat Jar file in production mode"
date = "2015-06-11"
tags = ["grails"]
+++

When creating a Grails WAR/JAR file using:
```console
$ grails war
```

The resulting artifact can be run in production mode using:
```console
$ java -Dgrails.env=prod -Dserver.port=9000 -jar <name-of-jar-file>.jar
```
