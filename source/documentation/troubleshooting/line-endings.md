## Pushing apps fails on Windows (line endings issue)

We are aware of some cases where pushing an app can fail if you are pushing from a Windows machine that has saved project files with Windows-style (CRLF) line endings.

This happens because some buildpacks do not interpret the CRLF line endings correctly. This is an example of an error arising from an executable script with CRLF line endings when using the Ruby buildpack:

```
2016-12-02T06:03:25.95-0800 [APP/PROC/WEB/0]ERR /usr/bin/env: ruby
2016-12-02T06:03:25.95-0800 [APP/PROC/WEB/0]ERR : No such file or directory
2016-12-02T06:03:25.95-0800 [APP/PROC/WEB/0]OUT Exit status 127
```

Similar problems may happen in other buildpacks. If you find that pushing an app from Windows is failing, try making sure that files in your project are being saved with Unix-style LF line endings, not Windows-style CRLF line endings. Most text editors aimed at developers allow you to change the line ending style.

If you are working with a Git repository, disable Git's `autocrlf` setting:

```
git config --global core.autocrlf false
```

then clone the repository again.