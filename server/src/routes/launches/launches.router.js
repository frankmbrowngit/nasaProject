const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller.js');
const launchesRouter = express.Router();
launchesRouter.delete('/:id',httpAbortLaunch);
launchesRouter.post('/',httpAddNewLaunch);
launchesRouter.get('/', httpGetAllLaunches);
module.exports = launchesRouter;