const express = require('express');
const cors = require('cors')
const apiRoutes = require('./routes/urls');
const logger = require('./middlewares/logger');

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger)

app.use('/api', apiRoutes);

module.exports = app;