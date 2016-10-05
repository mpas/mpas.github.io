+++
title = "Grails migrations and 'Waiting for changelog lock'"
tags = ["grails","migrations"]
date = "2013-02-28"
+++

Sometimes it may happen that the automatic migrations in a Grails project may come to a hold due to the fact that Liquibase keeps waiting for a changelog lock. At the end this will result in a application that is not going to be deployed.

```console
...
Waiting for changelog lock....
Waiting for changelog lock....
Waiting for changelog lock....
...
```

To solve this take the following steps:  

* Stop the application container (example: Tomcat)
* In the database look for a table called `DATABASECHANGELOGLOCK`
* In the table there is a record with id=1, change the following values:

```console
locked -> 0
lockgranted -> null
lockedby -> null
```

* After updating this record start the application container

**Notes:**   
To see who has locked the database (normally the local machine):

```sql
select * from DATABASECHANGELOGLOCK;
To update the record
update DATABASECHANGELOGLOCK
set locked=0, lockgranted=null, lockedby=null
where id=1
```
