+++
title = "Upgrading from Grails 2.3.8 to 2.4.2"
tags = ["grails"]
date = "2014-07-04"
+++

When upgrading to Grails 2.4.2 i ran into an issue where the following error message would pop up.

```console
Error creating bean with name 'grailsApplication' defined in ServletContext resource
[/WEB-INF/applicationContext.xml]: Cannot resolve reference to
bean 'grailsResourceLoader' while setting bean property 'grailsResourceLoader';
```

To solve this issue you need to delete some lines in the `<grails-app>/web-app/WEB-INF/applicationContext.xml` file.

Delete the following lines:

```xml
<property name="grailsResourceLoader" ref="grailsResourceLoader" />

<bean id="grailsResourceLoader" class="org.codehaus.groovy.grails.commons.GrailsResourceLoaderFactoryBean" />
```

And you should be up and running quickly.
