## Connect a PHP app to PostgreSQL or MySQL

If your PHP app uses a PostgreSQL or MySQL database, it must connect to that database securely using SSL. 

> These instructions assume that your app uses the PHP Data Objects (PDO) library to connect to either a MySQL or PostgreSQL backing service database.

You must configure your app to enable this secure connection by inserting the following code into the `config.ini` file located within `.bp-config/php/php.ini.d/`:

```
extension=pdo.so
extension=pdo_mysql.so OR pdo_pgsql.so
extension=openssl.so
```

You should use this method instead of the now-deprecated method of defining PHP extensions in the `.bp-config/options.json` buildpack config file.

You can find more information about how to configure the PHP buildpack at [https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html](https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html) [external link].

Refer to the code below for examples on how to connect your app to the databases.

### Example code - MySQL

```
$vcapServices = json_decode(getenv('VCAP_SERVICES'), true);
$creds = $vcapServices['mysql'][0]['credentials'];

try {
  $pdo = new PDO(
    sprintf('mysql:host=%s;port=%d;dbname=%s', $creds['host'], $creds['port'], $creds['name']),
    $creds['username'],
    $creds['password'],
    array(PDO::MYSQL_ATTR_SSL_CAPATH => '/etc/ssl/certs')
  );
  printf("Result was: %s\n", $pdo->query('SELECT 1')->fetchColumn());
} catch(Expection $e) {
  printf("Error: %s\n", $e->getMessage());
}
```

### Example code - PostgreSQL

```
$vcapServices = json_decode(getenv('VCAP_SERVICES'), true);
$creds = $vcapServices['postgres'][0]['credentials'];

try {
  $pdo = new PDO(
    sprintf('pgsql:host=%s;port=%d;dbname=%s', $creds['host'], $creds['port'], $creds['name']),
    $creds['username'],
    $creds['password']
  );
  printf("Result was: %s\n", $pdo->query('SELECT 1')->fetchColumn());
} catch(Expection $e) {
  printf("Error: %s\n", $e->getMessage());
}
```

## Connect Drupal to MySQL

If your Drupal app uses MySQL, it must connect to the database securely using SSL. You must configure Drupal to enable this secure connection by: 

- enabling required PHP extensions
- setting up the database connection

### Enable required PHP extensions

1. Create a `mysql.ini` file within `.bp-config/php/php.ini.d/`.
2. Add the following code to this .ini file:

    ```
    extension=pdo.so
    extension=pdo_mysql.so
    extension=openssl.so
    ```
You should use this method instead of the now-deprecated method of defining PHP extensions in the `.bp-config/options.json` buildpack config file.

You can find more information about how to configure the PHP buildpack at [https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html](https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html) [external link].

### Set up the database connection

Include the following code in your Drupal configuration file, located by default at `sites/default/settings.php`:

```
$vcapServices = json_decode(getenv('VCAP_SERVICES'), true);
$mysqlCreds = $vcapServices['mysql'][0]['credentials'];

$databases['default']['default'] = array(
  'driver' => 'mysql',
  'database' => $mysqlCreds['name'],
  'username' => $mysqlCreds['username'],
  'password' => $mysqlCreds['password'],
  'host' => $mysqlCreds['host'],
  'port' => $mysqlCreds['port'],
  'prefix' => 'drupal_',
  'collation' => 'utf8mb4_general_ci', // For Drupal 8
  // 'collation' => 'utf8_general_ci', // For Drupal 7 or earlier
  'pdo' => array(PDO::MYSQL_ATTR_SSL_CAPATH => '/etc/ssl/certs')
);
```

## Connect Wordpress to MySQL

Your Wordpress app must connect to MySQL securely using SSL. You must configure Wordpress to enable this secure connection by: 

- enabling required PHP extensions
- setting up the database connection
- patching Wordpress to enable SSL connections

### Enable required PHP extensions

1. Create a `mysql.ini` file within `.bp-config/php/php.ini.d/`.
2. Add the following code to this .ini file:

```
extension=mysqli.so
extension=openssl.so
```
You should use this method instead of the deprecated method of defining PHP extensions in the `.bp-config/options.json` buildpack config file.

You can find more information about how to configure the PHP buildpack at [https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html](https://docs.cloudfoundry.org/buildpacks/php/gsg-php-config.html) [external link].

### Set up the database connection

Replace the database configuration code in your `wp-config.php` file with the following code:


```
$vcapServices = json_decode(getenv('VCAP_SERVICES'), true);
$mysqlCreds = $vcapServices['mysql'][0]['credentials'];

define('DB_NAME', $mysqlCreds["name"]);
define('DB_USER', $mysqlCreds["username"]);
define('DB_PASSWORD', $mysqlCreds["password"]);
define('DB_HOST', $mysqlCreds["host"]);
define('MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL);
define('MYSQL_SSL_CAPATH', "/etc/ssl/certs");
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');
```

### Patch Wordpress to enable SSL connections

Insert the following code before the `mysqli_real_connect` function call in the `wp-includes/wp-db.php` file:


```
[...]

// Included block start
mysqli_ssl_set($this->dbh, null, null, null, MYSQL_SSL_CAPATH, null);
// Included block end

if ( WP_DEBUG ) {
    mysqli_real_connect( $this->dbh, $host, $this->dbuser, $this->dbpassword, null, $port, $socket, $client_flags );
} else {
    @mysqli_real_connect( $this->dbh, $host, $this->dbuser, $this->dbpassword, null, $port, $socket, $client_flags );
}
[...]
```

