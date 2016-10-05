+++
title = "Distributed Deployment with Hudson & SSH"
tags = ["deployment","continous integration","hudson","ssh"]
date = "2012-09-09"
+++

Have you already implemented an multi-server artifact deployment using a [Continuous Integration][ci] Engine? If not, then read ahead and maybe this article is of help.

#### The need for Continuous Integration ####

A good practice in a software development methodology and lifecycle is the use of a [Continuous Integration][ci] Engine. The adoption of [Continuous Integration][ci] improves you software quality by quickly reporting failed builds so you can modify/correct your code. Popular Continuous Integration Engines can often be extended with software quality tooling so you can report on specific quality aspect of your software.

Thus informing developers and even other people who take an interest in the status of the latest build. **IMHO** a failed build can also be identified as code that compiles but that does not meet the quality standards set by your organization. You are off-course totally free in defining what in your opinion a failed build actually means!

A good build compiles, quality requirements have been met and automatic functional and unit testing has been successful.

There a few popular [Continuous Integration][ci] Engines available:

* [Hudson Extensible Continuous Integration Server][hudson]
* [CruiseControl][cruisecontrol]
* [Bamboo][bamboo]

Probably there a some more, but for me needs the [Hudson Extensible Continuous Integration Server] works perfect.

#### My needs ####

My Continuous Integration Engine:

* Must support multiple programming languages Java/.Net/Ruby
* Runs on multiple operating systems (Windows/Mac/Linux)
* Pluggable in the sense that there must be integration with for example JUnit, JMeter, Cobertura, Checkstyle etc.
* Must be able to send out notifications using email, twitter, Instant Messaging
* Seemless integration with CVS/SubVersion and GIT
* Simple and easy Configuration
* Must support timed builds & trigger builds from [SCM][scm] commits
* Maintain a link between modified code and
* and some more..

All of these requirements and more have been succesfully fulfilled by using [Hudson][hudson]

#### Hudson and automatic deployment ####

In every project a recurring problem arises, artifacts of a software build have to be distributed accross different servers and environments. How are the build artifacts going to be distributed and deployed? Why not let the [Hudson][hudson] server give a helping hand!!

#### Deployment Scenario ####

In the following scenario we will be distributing build artifacts from a central Hudson server to three different [JBoss][jboss] application servers al running Windows 2003 Server as Operating System. Next to the [Hudson][hudson] server we have a [Subversion][svn] system which is used for [SCM][scm] purposes.

#### Distribution of build artifacts ####

After a succesfull build, the artifacts have to be distributed to remote machines. Offcourse the latest code has been checked out from the SVN repository, compiled and tested. The distribution of the artifacts can be done in various ways. One can use Ftp, shared folders, SCM checkin etc..

For me the most easiest way to distribute build artifacts is using [Secure Shell access aka SSH][ssh]. This is a secure and a standardized manner for distribution. Lets assume we have the build artifacts somewhere on our [Hudson][hudson] server, we need a way of transfering them using [SSH][ssh] to a remote machine.

To accomplish this we need SSH access to the remote machine. With the help off [CopSSH][copssh] installing SSH is a breeze!

#### Prepare for installation of SSH ####

Prepare yourself by downloading:

* [CopSSH][copssh] – [SSH][ssh] service for Windows
* [Putty][putty] – [SSH][ssh] client (used for connection to the SSH service)
* [PSCP][pscp] – [SSH][ssh] client for file transfer
* [Plink][plink] – [SSH][ssh] client for executing remote commands

#### Installing and enable remote access using SSH ####

* Install [CopSSH][copssh] on the remote system
* On the remote system enable a user for [SSH][ssh] access, see the installation guide of CopSSH
* Start [Putty][putty] on your local machine
* Using Putty connect to the remote system and exchange security credentials

You are now officially ready to remotely access the system using SSH
If you want to enable the Hudson server to access the remote system, start Putty on the Hudson server and repeat step 4!

**Note**: Make sure that your Hudson uses the same credentials then the account in which you exchange security credentials, otherwise remote access from Hudson server to the remote system will not work!

#### Execute remote commands and Exchange files using SSH ####

If you can succesfully access the remote server using Putty, it is time to exchange files or execute remote commands. This can be done by using 2 small commandline utilities called PSCP for file transfer and Plink for executing remote commands such as remotely deleting files etc.

Make sure these are in you PATH settings so you can execute them everywhere!

Examples for executing a remote command (substitute the %parameters% with your own ones)
```console
#create a directory
plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME%  mkdir C:/tmp

#delete a directory
plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME%  rm -rf C:/tmp

#stop a windows service
plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME%  net stop %SERVICENAME%

#upload a file
pscp -pw %PASSWORD% %SOURCE% %USERNAME%@%HOSTNAME%:%DESTINATION%

#upload multiple files
pscp -pw %PASSWORD% %SOURCE%\*.* %USERNAME%@%HOSTNAME%:%DESTINATION%
```
#### The return of the .bat file ####

So far we have enabled remote access using SSH / CopSSH, executed remote commands and transferred files. All the needed ingredients are in place to enable our Hudson server to remotely deploy build artifacts. In the job configuration of Hudson you can trigger a batch file after a succesfull build, so whenever a succesfull build occurs trigger a batch that executes a few commands to quickly deploy build artifacts to any number of remote servers.

In our case all deployment artifacts are copied to a central directory per project. So if we need to deploy a build, we can copy parts or the whole directory contents to a remote server.

To give an example see the following batch files: Main example for a batchfile that triggers stopping of the remote Windows Services gives the instruction on which files need to be remotely deployed and start the services again.

```batch
-> filename = upload-project-to-development.bat
@CLS
@ECHO OFF
SET USERNAME=%1
SET PASSWORD=%2
SET HOSTNAME=%3
SET JBOSSDIR=%4
SET SOURCEDIR=%5
@ECHO : - start upload procedure
@ECHO : -- stopping servers
@plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME% net stop JBoss
@ECHO : -- uploading files CALL upload-files.bat %USERNAME% %PASSWORD% %HOSTNAME% %JBOSSDIR% %SOURCEDIR%\*.*
@ECHO : -- starting servers
@plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME% net start JBoss
@ECHO : - finished upload procedure
```

The above script can be called easily by the Hudson server after a succesfull deployment.

**example:**

```console
upload-project-to-development scott tiger 10.0.0.100 d:/java/server/jboss-v5.0 d:/build_artifacts/projectx
```
**The example above:**  

* Stops the JBoss server on the 10.0.0.100 host
* Passes some parameters to a file called “upload-files.bat” script
* Starts the JBoss servers again

The script that executes the actual maintenance and uploads is the “upload-files.bat file”. All parameters are passed in by the calling script.

```batch
-> filename = upload-files.bat
@ECHO OFF
SET USERNAME=%1
SET PASSWORD=%2
SET HOSTNAME=%3
SET JBOSSDIR=%4
SET SOURCE=%5
SET DESTINATION=%JBOSSDIR%/deploy
@ECHO  : - %HOSTNAME% - starting file copy
@ECHO  : -- %HOSTNAME% - deleting JBOSS tmp
@plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME% rm -rf %JBOSSDIR%/tmp
@plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME% mkdir %JBOSSDIR%/tmp
@ECHO  : -- %HOSTNAME% - deleting JBOSS work
@plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME% rm -rf %JBOSSDIR%/work
@plink -batch -pw %PASSWORD% %USERNAME%@%HOSTNAME% mkdir %JBOSSDIR%/work
@ECHO  : -- %HOSTNAME% - deleting previous ears + jars
@plink -batch  -pw %PASSWORD% %USERNAME%@%HOSTNAME% rm %JBOSSDIR%/deploy/*.ear
@plink -batch  -pw %PASSWORD% %USERNAME%@%HOSTNAME% rm %JBOSSDIR%/deploy/*.jar
@ECHO  : -- %HOSTNAME% - copy remote files
@pscp -pw %PASSWORD% %SOURCE% %USERNAME%@%HOSTNAME%:%DESTINATION%
@ECHO  : - %HOSTNAME% - finishing file copy
```

**The example above:**

* Removes the JBoss tmp & work directory
* Removes artifacts from previous builds
* Copies the artifacts to the remote JBoss deploy directory

#### Steps taken ####

So the list of tasks executed by calling the batch files with the correct parameters are:

* Stopping the remote JBoss server
* Removing the remote JBoss tmp & work directories
* Removing the remote JBoss artifacts from previous deployments
* Copy files to the remote JBoss server
* Starting the JBoss server again

#### From build to deployment ####

So with a quick installation of SSH/Putty/Plink/PSCP we now have a modular and easy way of distributing files to remote systems. Offcourse there are lots of improvements to make, but for now it works without any problems!

The given examples can be easily modified so that after a succesfull build the artifact deployment to all of your servers can be done in a very simple and easy way.
Notes

[ci]:http://en.wikipedia.org/wiki/Continuous_integration
[hudson]:http://hudson-ci.org/
[cruisecontrol]:http://cruisecontrol.sourceforge.net/
[bamboo]:http://www.atlassian.com/software/bamboo/
[scm]:http://en.wikipedia.org/wiki/Revision_control
[svn]:http://subversion.tigris.org/
[jboss]:http://www.jboss.org/
[ssh]:http://en.wikipedia.org/wiki/Secure_Shell
[copssh]:http://www.itefix.no/i2/node/27
[putty]:http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html
[pscp]:http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html
[plink]:http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html
