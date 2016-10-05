+++
title = "Loading external Configuration files in a Grails application"
tags = ["grails","configuration"]
date = "2012-09-16"
+++

The use of 'Config.groovy' as a placeholder for configuration settings is nice, but not always sufficient. The 'Config.groovy' file will get compiled and packaged inside the WAR file you are creating. If you want to externalize the configuration and have a need to configure settings outside the deployed (WAR file) application you can use property files (.properties) to achieve that.

A simple mechanism to load these property files is to place a short snippet of code in the 'Config.groovy' that will load a specific configuration file from the filesystem, depending on the availability.

```groovy
grails.config.locations = ["classpath:application-config.properties", "file:./application-config.properties"]
```

This snippet will first try to load the property file from the classpath and if that fails you have a backup on the filesystem. This opens opportunities to load a different property file during development! When you deploy the application you can place the 'application-config.properties' file inside a folder which is available in the classpath. For Apache Tomcat this would be the 'lib' folder!

This gives the opportunity to configure the application outside the 'Config.groovy' file so any changes made the the property file will be reflected in your environment.
