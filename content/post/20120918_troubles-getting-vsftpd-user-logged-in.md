+++
title = "Troubles getting vsftpd user logged in?"
tags = ["ftps","linux","ubuntu","vsftpd"]
date = "2012-09-18"
+++

Recently i had the pleasure of installing and using vsftp on a Ubuntu Linux 12.04 system. I closely followed the instructions but keeped getting my head banging against a wall with an error message:
500 OOPS: vsftpd: refusing to run with writable root inside chroot()

After some googling around i found the following fix..
chmod the folder that the ftp user comes in to as he first login (root folder) by using in terminal:

```console
sudo chmod a-w /home/user
```

Create a subfolder within the folder, either by the use of GUI or if you only have terminal it's:

```console
sudo mkdir /home/user/newfolder
```

Now you should be able to log in and read write within the "newfolder".

You will **NOT** be able to write in the root folder itself from the ftp with the chmod a-w, so that is the reason for the subfolder, there you can.

[http://askubuntu.com/questions/128180/vsftpd-stopped-working-after-update](http://askubuntu.com/questions/128180/vsftpd-stopped-working-after-update)
