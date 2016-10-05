+++
title = "Skip a contenttype/section to be renderend"
tags = ["hugo"]
date = "2014-06-09"
+++

When creating a layout it may occur that you want to skip rendering certain types of content, or render only specific content in a part of your layout.

Example:
You want to only render contenttype 'post'  use the following code in your template:

```go
{{ if eq .Type "post" }}

    {{ .Title }}
    {{ .Content }}

{{ end }}
```
