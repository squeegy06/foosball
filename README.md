# foosball
A node js foosball stat tracker for corePHP

Make sure you run
```
npm install
```

You also will need to create a config file with at least the basics to connect to your mysql database.
```javascript
//config.js
var config = {
	database: {
		user: "root",
		password: "password",
		host: "localhost",
		database: "foosball"
	}
}

module.exports = config;
```

Finally, run the database.sql file to setup your database.
```
mysql -u root -p < database.sql
```

Eventually I'll use a better method for database management, you're welcome to create your own database manually if you want.