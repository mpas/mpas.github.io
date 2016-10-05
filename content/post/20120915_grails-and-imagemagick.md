+++
title = "Combining ImageMagick and Grails"
tags = ["grails","imagemagick"]
date = "2012-09-15"
+++

When there is a need to work with images (thumbnailing, watermark, resize etc.) there is always ImageMagick that comes to the rescue. Combining this image utility powerhouse with the Grails framework is a task which can be easily accomplished.

**Steps:**

* Install ImageMagick according to the installation instructions.
* It contains a utility called convert which we will need later on! This utility takes care of the conversion of images to thumbnails, watermarks etc. So remember where this utility is installed on your system!
* Make sure that ImageMagick is installed correctly be converting an image to a thumbnail by using the following command in a terminal.

```console
/opt/local/bin/convert <filename> -thumbnail 70x70 <thumbnail-filename>
```

**example:**
```console
/opt/local/bin/convert /tmp/image-001.jpg -thumbnail 70x70 /tmp/thumbnail-image-001.jpg
```
Create some code that calls the ImageMagick convert utility with the correct parameters to enable you to achieve what you want. Something like below:

```groovy
def createThumbnail(File file) {
   def command = "/opt/local/bin/convert ${file.canonicalPath} " +
                 "-thumbnail 70x70 " +
                 "/images/thumbs" + File.separator + "${file.name}"
   def proc = Runtime.getRuntime().exec(command)
   int exitStatus;
   while (true) {
       try {
           exitStatus = proc.waitFor();
           break;
       } catch (java.lang.InterruptedException e) {
           log.debug("Creating thumbnail - Interrupted: Ignoring and waiting")
       }
   }
    if (exitStatus != 0) {
        log.error("Error executing command: exitStatus=[${exitStatus}]")
    }
    log.debug("Succesfully created thumbnail")
    return (exitStatus == 0);
}
```

The above should give you some idea on how you could integrate Grails and ImageMagick into your own application.
