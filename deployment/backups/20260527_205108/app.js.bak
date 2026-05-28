const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;