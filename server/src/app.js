const express = require('express');
const cors = require('cors');
const app = express();
const planetsRouter = require('./routes/planets/planets.router.js');
const path = require('path');
// JSON parsing middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));
app.use(planetsRouter);

module.exports = app;