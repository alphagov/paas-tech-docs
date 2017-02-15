## Push failure from Windows due to CRLF

Pushing an app can fail if you are pushing from a Windows machine that has saved the app files with Windows-style (CRLF) line breaks.

In interpreted languages, you will get a `No such file or directory` error.

This is an example of the error with Ruby:

```
2016-12-02T06:03:25.95-0800 [APP/PROC/WEB/0]ERR /usr/bin/env: ruby
2016-12-02T06:03:25.95-0800 [APP/PROC/WEB/0]ERR : No such file or directory
2016-12-02T06:03:25.95-0800 [APP/PROC/WEB/0]OUT Exit status 127
```

If you find that pushing an app from a Windows machine is failing like this, you must make sure that files are not being saved with CRLF line breaks. Check the settings in your text editor or IDE.

If the files are from a Git repository, disable Git's `autocrlf` setting:

```
git config --global core.autocrlf false
```

then clone the repository again.