const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/urls');
const logger = require('./middlewares/logger');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public/views')));

app.use(logger)

app.use('/api', apiRoutes);

module.exports = app;