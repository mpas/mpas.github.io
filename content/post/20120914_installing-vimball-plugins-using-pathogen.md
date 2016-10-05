+++
title = "Installing Vimball plugins when using Pathogen"
tags = ["vim","pathogen"]
date = "2012-09-14"
+++
No need to discuss that [Vim](http://www.vim.org/) is truly a great text editor. Wealth of features, great speed and extensive support for plugins. The installation of plugins is very easy. If you want to learn how to install plugins, make sure to check out the [wiki](http://www.installationwiki.org/Installing_Vim_Scripts).

#### Pathogen

When you instal a plugin one may copy the files to the plugin directory. In a later stage you also want to delete a plugin and then the hunt for files starts. You need to track down which files belong to the specific plugin you want to delete. [Pathogen](http://tammersaleh.com/posts/the-modern-vim-config-with-pathogen) to the rescue :)

Pathogen enables you to create sub-folders inside a bundle-folder which will acts a place holder for all your plugins nicely separated in a ‘folder per plugin’ structure. So if you need to delete a plugin then you just delete the correct plugin-folder and everything is gone.

Normal installation of a Vim script is standard, you create a sub-folder below the bundle-folder, copy the Vim script and all is ok. BUT when you want to use a [vimball](http://www.vim.org/scripts/script.php?script_id=1502) then you need to do some additional steps.

* Create a folder in which you want to later on extract the vimball. Preferably below the ‘bundle’ folder.
```console
mkdir ~/.vim/bundle/align
```console

* Open the vimball with command ‘:e 'location of your vimball’/‘name of your vimball'
```console
:e ~/Downloads/Align.vba
```
* Tell Vim to use the vimball by issuing command ‘:UseVimball 'location to extract’'
```console
:UseVimball ~/.vim/bundle/align
```
* Restart your Vim and your plugin should be available.
