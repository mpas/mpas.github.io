+++
title = "Getting the Enum from a String value"
tags = ["enum","java"]
date = "2013-01-03"
+++

Ever asked yourself the question how you could get the Enum from a String value? This is particularly usefull when you use Enum values in your screens and pass back the value of the enum!

```groovy
Enum.valueOf(YourClassName.class, "String Value")
```

[http://docs.oracle.com/javase/6/docs/api/java/lang/Enum.html](http://docs.oracle.com/javase/6/docs/api/java/lang/Enum.html)
