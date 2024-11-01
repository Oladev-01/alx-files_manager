const express = require('express');
const routes = require('./routes/index');
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { PORT } = process.env || 5000;

const app = express();

app.use('/', routes);

app.listen(PORT, () => { console.log('server is listening on port', PORT); });
