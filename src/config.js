const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8081;

const config = {
  route: process.env.MONGO_DB_ROUTE,
  db: process.env.MONGO_DB_NAME,
  port: port
};

const RESPONSES = {
  OK: 200,
  BAD: 400,
  INTERNAL_ERROR: 500
};

module.exports = {
  config,
  RESPONSES
};
