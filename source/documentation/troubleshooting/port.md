## PORT environment variable error

The PORT environment variable is system-provided, and you should not attempt to set it yourself.

If you are trying to set any environment variable and you get an error like this:

```
FAILED Server error, status code: 400, error code: 100001, message: The app is invalid: environment_variables cannot set PORT
```

the cause is that the value of PORT has been changed from the system-provided value.

Running these commands should fix the problem:

```
cf unset-env myapp PORT
cf restage myapp
```

where `myapp` is the name of the affected app instance.

Make sure that the app does not attempt to set the PORT variable.