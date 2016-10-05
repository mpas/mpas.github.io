+++
title = "Funcional Code Coverage using Cobertura"
tags = ["coverage","testing","cobertura","continous integration","hudson","jenkins","ssh"]
date = "2012-09-10"
+++

So assume you are assigned to a JEE/Web project with no written functional requirements, no technical design, no functional and unit tests and even no business process description. Sounds really hopeless, but it is your responsibility to learn the system and make adjustments to it. Does this sound familiar?? Hopefully not :) But every now and then this scenario seems to happen.

One can start to complain :), stop working on the project or even better master the concept of [Software Archeology][archaeology]. An additional thing is to adopt the use of [Cobertura][cobertura] a code coverage tool which can easily be used to track down Functional Code Coverage. Normally the concept of Code Coverage is used to identify what code is executed during development and test phase. This to give an indication on how much code you cover with your testing strategy (often unit testing). This is **IMHO** something you will always want to know! But in the case you do not have unit tests or creating them is impossible due to the technical/organisational nature of the project, you can rely on creating functional tests and still track down the 'functional' coverage with tools like [Cobertura][cobertura] (or alternatives like [Emma][emma]).

**This tackles several problems:**  
You are creating functional tests which can be used for regression testing
You are creating awareness on how little is tested or is known about the system
Note: By functional testing we mean that we are going to test via the Web layer of the JEE project To see an example on how the reporting looks like, check out this [sample][sample] report!

#### How to get Code Coverage information ####

**General process:**

* Compile your software
* Instrument the compiled code
* Deploy your instrumented code and start the application
* Use the application or run automated functional tests
* Shutdown the application
* Generate your Code Coverage reports
* no step 7! All done :)

The remaining part of this article is going to describe how you can get Functional Code Coverage information in the process of continously building, deploying and testing your software. Some elements are not explained due to the fact that other extensive information is given somewhere else on the web!

#### Compile, Instrument and Build ####

The [Maven][maven] project enables you to build your software with great ease. Giving a few simple commands makes it able to build a project, deploy it and even integrate it with tools and technologies such as  Cobertura. There is a even a [Cobertura Maven][coberturamaven] Plugin to easily use [Cobertura][cobertura] in a [Maven][maven] build. We need to use Cobertura in the build phase because it will instrument the compiled code and generate a small file called 'cobertura.ser' which is used as a kind of database that stores each call to a piece of code. The instrumented code and the database file are crucial because they contains all information needed to generate code coverage reports later on.

#### Run and Test ####

After the code is succesfully instrumented you may deploy the build artifacts together with the 'cobertura.ser' file inside a JBoss JEE container and run your application.

Note: In our project we used [JBoss][jboss] but offcourse you can use other application servers!

The [JMeter][jmeter] project delivers an excellent tooling and technology which enables you to record your functional flow and lets you replay a scenario which was recorded earlier on. For more information on [JMeter][jmeter] recording and usage, please check the [JMeter][jmeter] project. But for now lets assume you have created a couple of functional tests, so you can execute them.

#### Generate coverage reports ####

After the functional tests have been executed, the modified database file 'cobertura.ser' can be collected and reports can be generated. Cobertura has some nice predefined reporting templates. After these stepes you should have inisight on what code is actually executed during a functional flow and this may contribute to your understanding of the application.

#### Not once but do it always! ####

The process of compiling, instrumenting, deploying, testing and reporting can be fully automatized. The famous Hudson comes to the rescue! When corectly implemented Hudson will serve you all information that you need on the moments you need it!

#### Tools & Technologies #####

The folowing list provides information on the tools that are used:

* [Maven][maven] -> used info for compiling and instrumenting your code (alternative to [Ant][ant])
* [Cobertura][cobertura] -> used to get Code Coverage information
* [JBoss][jboss] -> used for running a JEE project
* [JMeter][jmeter] -> used to record and playback functional tests
* [Hudson][hudson] -> used to automatically build & test your software


[archaeology]:http://se-radio.net/podcast/2009-11/episode-148-software-archaeology-dave-thomas
[emma]:http://emma.sourceforge.net/
[sample]:http://cobertura.sourceforge.net/sample/
[codecoverage]:http://http//en.wikipedia.org/wiki/Code_coverage
[ant]:http://ant.apache.org/
[maven]:http://maven.apache.org/
[cobertura]:http://cobertura.sourceforge.net/
[coberturamaven]:http://mojo.codehaus.org/cobertura-maven-plugin/
[jboss]:http://www.jboss.org/
[jmeter]:http://jakarta.apache.org/jmeter/
[hudson]:http://hudson-ci.org/
