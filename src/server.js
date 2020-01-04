const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./routes/routes');
const { config } = require('./config');

// initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/', router);
app.listen(config.port, () => console.log(`LISTENING ON PORT ${config.port}`));

// connect to mongoose && test connection
console.log(`MONGO DB ROUTE: ${config.route}`);
console.log(`MONGO DB NAME: ${config.db}`);

mongoose.connect(config.route, { dbName: config.db, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {}).on('error', console.error.bind(console, 'MongoDB connection error:'));

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
}
