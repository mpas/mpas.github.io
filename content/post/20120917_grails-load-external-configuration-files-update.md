+++
title = "Loading Grails configuration files update!"
tags = ["grails","configuration"]
date = "2012-09-17"
+++

We recently changed the way how we load configuration files in a Grails project. Normally we to use the .properties file format, but this has some serious disadvantages.

* You cannot deal with all Grails Mail settings in the configuration file
* You cannot use the log4j DSL to extract the logging configuration outside your application
* etc..

In our hunt for a good way to load configuration files we asked question on the mailinglist and also found this [blogpost](http://www.baselogic.com/blog/development/java-javaee-j2ee/getting-grails-external-configuration-working-in-the-real-world/) which was the start for our implementation of loading the external configuration files.

We modified some small things and added a way of loading a configuration file that is resident in the root of a Grails project. So when developing with IntelliJ for example the config file is at your fingertips in the root of the application project structure. We must also note that we are very happy with the fact that the Grails community was more then helpfull in helping us out here!
```groovy
// -------------------------------------------------------------------------------- //
// - START: CONFIGURATION FILE LOADING -------------------------------------------- //
// -------------------------------------------------------------------------------- //
// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts
def ENV_NAME = "${appName}.config.location"
if(!grails.config.locations || !(grails.config.locations instanceof List)) {
    grails.config.locations = []
}
println "--------------------------------------------------------------------------------"
println "- Loading configuration file                                                   -"
println "--------------------------------------------------------------------------------"
// 1: check for environment variable that has been set! This variable must point to the
// configuration file that must be used. Can be a .groovy or .properties file!
if(System.getenv(ENV_NAME) && new File(System.getenv(ENV_NAME)).exists()) {
    println("Including System Environment configuration file: " + System.getenv(ENV_NAME))
    grails.config.locations << "file:" + System.getenv(ENV_NAME)

// 2: check for commandline properties!
// Use it like (examples):
//      grails -D[name of app].config.location=/tmp/[name of config file].groovy run-app
// or
//      grails -D[name of app].config.location=/tmp/[name of config file].properties run-app
//
} else if(System.getProperty(ENV_NAME) && new File(System.getProperty(ENV_NAME)).exists()) {
    println "Including configuration file specified on command line: " + System.getProperty(ENV_NAME)
    grails.config.locations << "file:" + System.getProperty(ENV_NAME)

// 3: check on local project config file in the project root directory
} else if (new File("./${appName}-config.groovy").exists()) {
    println "*** User defined config: file:./${appName}-config.groovy ***"
    grails.config.locations = ["file:./${appName}-config.groovy"]
} else if (new File("./${appName}-config.properties").exists()) {
    println "*** User defined config: file:./${appName}-config.properties ***"
    grails.config.locations = ["file:./${appName}-config.groovy"]

// 4: check on local project config file in ${userHome}/.grails/...
} else if (new File("${userHome}/.grails/${appName}-config.groovy").exists()) {
    println "*** User defined config: file:${userHome}/.grails/${appName}-config.groovy ***"
    grails.config.locations = ["file:${userHome}/.grails/${appName}-config.groovy"]
} else if (new File("${userHome}/.grails/${appName}-config.properties").exists()) {
    println "*** User defined config: file:${userHome}/.grails/${appName}-config.properties ***"
    grails.config.locations = ["file:${userHome}/.grails/${appName}-config.properties"]

// 5: we have problem!!
} else {
    println "********************************************************************************"
    println "* No external configuration file defined                                       *"
    println "********************************************************************************"
}
println "(*) grails.config.locations = ${grails.config.locations}"
println "--------------------------------------------------------------------------------"
// -------------------------------------------------------------------------------- //
// - END: CONFIGURATION FILE LOADING ---------------------------------------------- //
// -------------------------------------------------------------------------------- //
```
