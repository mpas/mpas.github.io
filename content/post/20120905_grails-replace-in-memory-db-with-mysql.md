+++
title = "Using MySQL instead of in-memory database for a Grails application"
tags = ["grails","mysql"]
date = "2012-09-05"
slug = "grails-replace-in-memory-db-with-mysql"
+++

A Grails application by default uses a in-memory HSQL database. To switch to a MySQL database the steps are simple and straightforward.

* Download the MySQL JDBC driver [called a connector] from the MySQL website
* Extract the zip or tar archive
* Copy the driver (at this time of writing called `mysql-connector-java-5.1.13-bin.jar` into the `grails-app/lib` directory
* Configure your application datasource in file `grails-app/conf/DataSource.groovy`    

```groovy
development {
    dataSource {
       dbCreate = "create-drop" // one of 'create', 'create-drop','update'
       url = "jdbc:mysql://localhost:<port>/<database>"
       driverClassName = "com.mysql.jdbc.Driver"
       port =  // default 3306
       username = "<username>"
       password = "<password>"
    }
}
```
