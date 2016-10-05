+++
title = "Testing constraints with Build Test Data"
tags = ["build","testdata","grails","spock","test"]
date = "2013-01-13"
+++

The [Spock](http://grails.org/plugin/spock) & [Build Test Data](http://grails.org/plugin/build-test-data) plugins both are wonderful additions to your toolkit if you are creating tests without getting into the hassle of constantly building up your object graph. You can focus on what you want to test!

When testing constraints on an object it can be used as follows:

```groovy
class Foo {
    String name   // name of foo
    Integer age   // age of foo

    static constraints = {
        name nullable: false, blank: false // name may never be nullable or blank
        age nullable: true
    }
}
```

And the Spock test

```groovy
@Build(Foo)
@TestFor(Foo)
class FooSpec extends Specification {

    def "Name of Foo must exist"() {
        given: "setting up the constraints"
        mockForConstraintsTests(Foo)

        when: "creating a Foo"
        Foo foo = Foo.buildWithoutSave()

        then: "validation should trigger"
        assertFalse foo.validate()

        and: "validation error should be on the value field"
        assert foo.errors.allErrors.first().field == "name"
    }

}
```
