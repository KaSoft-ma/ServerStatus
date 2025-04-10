const { Connection } = require('tedious');

function checkSqlConnection() {
  return new Promise((resolve, reject) => {
    const config = {
      server: process.env.SQL_SERVER,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD,
        },
      },
      options: {
        database: process.env.SQL_DATABASE,
        encrypt: false, // change to true if using Azure SQL
        trustServerCertificate: true,
        connectTimeout: 5000,
      },
    };

    const connection = new Connection(config);

    connection.on('connect', err => {
      if (err) {
        resolve({ success: false, message: err.message });
      } else {
        resolve({ success: true });
      }
      connection.close();
    });

    connection.connect();
  });
}

module.exports = { checkSqlConnection };
