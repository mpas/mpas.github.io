+++
title = "Installing Markdown on OSX and use it inside VIM"
tags = ["vim","markdown","osx"]
date = "2012-09-13"
+++

Back again to one of my favorites which is called [Markdown][markdown]. Once every now and then i forget how easy it is. Normally i use [Textmate][textmate] to do all my writing, but recently i have picked up [VIM][vim] to do some editing etc. Why i did chose VIM? I will not trouble you with that decision :)

Using Textmate everything is easy, but when you want to use Markdown inside VIM it is somewhat different. But anything is different when using VIM :)

#### Steps ####

* download Markdown from - [The home of Markdown][markdown], It’s usual place as this is a Perl script you need to put it somewhere so OSX is able to execute it.
* start your terminal and create a directory inside `usr/local/bin`
* extract the downloaded file and put the `Markdown.pl` file * inside the `user/local/bin` directory
* inside the terminal chmod the `Markdown.pl` to 777
* using the [Installing Markdown as OSX Service][service] creates a service to use Markdown
* You are done… :)

[markdown]:http://daringfireball.net/projects/markdown/
[textmate]:http://macromates.com/
[vim]:http://www.vim.org/
[service]:http://gothick.org.uk/2010/08/04/installing-markdown-as-a-os-x-service-using-automator-in-snow-leopard/
