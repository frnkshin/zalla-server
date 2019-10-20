const dotenv = require('dotenv');
dotenv.config();

let port;
if (process.env.NODE_ENV == "test") {
  database = "testDB";
  port = 3002;
} else {
  database = "prodDB";
  port = 3001;
}

const config = {
  DB_URL: process.env.MONGO_DB_ROUTE,
  DB: database,
  PORT: port
};

module.exports = config;