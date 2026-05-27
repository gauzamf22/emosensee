const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;