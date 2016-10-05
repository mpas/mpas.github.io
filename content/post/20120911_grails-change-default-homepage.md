+++
title = "Change default homepage for a Grails application"
tags = ["grails"]
date = "2012-09-11"
+++

You can set the default homepage for a Grails application by modifying the `grails-app/conf/UrlMappings.groovy` file. In a new Grails application this file will look like

```groovy
class UrlMappings {
    static mappings = {
        "/$controller/$action?/$id?"{
            constraints {
                // apply constraints here
            }
        }
        "/"(view:"/index")
        "500"(view:'/error')
    }
}
```
Replace the line:
```groovy
"/"(view:"/index")
```
with:
```groovy
"/"(controller:'home', action:"/index")
```
This will result in the fact that when you start your Grails application and you enter the URL for your application it will trigger the **HomeController** and corresponding **index** action related to that controller.
