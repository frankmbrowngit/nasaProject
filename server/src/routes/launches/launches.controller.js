const { getAllLaunches, scheduleNewLaunch, abortLaunchById, existsLaunchWithId } = require('../../models/launches.model.js');
async function httpAddNewLaunch(req,res) {
    // 201 = created
    const launchData = req.body;
    if (!launchData || !launchData.rocket || !launchData.launchDate || !launchData.target) {
        // 400 response status code = client errors / bad request
        return res.status(400).json({ 
            error: 'Missing required launch property'
        })
    }
    launchData.launchDate = new Date(launchData.launchDate);
    if (isNaN(launchData.launchDate)) {
        return res.status(400).json({
            error: 'Invalid date'
        })
    }
    await scheduleNewLaunch(launchData);
    console.log(launchData);
    return res.status(201).json(launchData);
}
async function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id);
    const exist = await existsLaunchWithId(launchId);
    if (!exist) { 
        // if launch doesn't exist 
        return res.status(404).json({
            error: 'Launch not found'
        })
    }   
    // if launch does exist
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
        res.status(404).json({
            error: 'Launch not aborted'
        })
    }
    return res.status(200).json({
        OK: true
    })
}
const { getPagination } = require('../../services/query.js');
async function httpGetAllLaunches(req,res) {
    const {skip, limit} = getPagination(req.query);
    return res.status(200).json(await getAllLaunches(skip,limit)); // Array.from(Map.values() => iterable) => array
}
module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }