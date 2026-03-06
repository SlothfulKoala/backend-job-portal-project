const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/urls');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public/views')));

app.use('/api', apiRoutes);

module.exports = app;