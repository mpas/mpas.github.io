+++
title = "Cleaning Grails Domain Objects in a Spock Test"
date = "2015-10-30"
tags = ["grails", "spock"]
+++

Spock is a nice framework to execute integration tests in your Grails application. It may happen that the Spock test actually creates some domain objects and you want to clean them out on everuy single run of your feature test methods.

Spock provides a ```setup()``` and ```cleanup()``` method.

When you want to remove your domain objects after each feature test has run you can execute the following:

```groovy
def setup() { ... }

def cleanup() {
        // make sure to clear out the database on after test
        <YourDomainObject>.withNewSession {
            <YourDomainObject>.findAll().each { it.delete(flush: true) }
        }
}
```

We need the ```.withNewSession``` because there is no Hibernate session provided in the ```setup()``` and ```cleanup()``` methods.
