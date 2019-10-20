const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = require('./routes/routes');
const config = require('./config');

// initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api', router);
app.listen(config.PORT, () => console.log(`LISTENING ON PORT ${config.PORT}`));

// connect to mongoose && test connection
mongoose.connect(config.DB_URL,{ dbName: config.DB, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection
    .once('open', () => {})
    .on('error', console.error.bind(console, 'MongoDB connection error:'));

if (process.env.NODE_ENV == "test") {
    module.exports = app;
}
