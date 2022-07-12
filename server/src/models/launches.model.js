const launchesDatabase = require('./launches.mongo.js');
const planets = require('./planets.mongo.js');
const axios = require('axios');

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';



async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL,{
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        'name': 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });
    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {return payload['customers']})
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket'].name,
            launchDate: launchDoc['date_local'],
            target: '',
            customers,
            upcoming: launchDoc['upcoming'], // upcoming
            success: launchDoc['success'] // success
        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
}

}
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if (firstLaunch) {
        console.log('Launch Data already loaded');
        return;
    } else {
        await populateLaunches();
    }
    
    } 
async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return 100;
    } else {
        return latestLaunch.flightNumber;
    }
}

async function getAllLaunches(skip,limit) { // data access function
    return launchesDatabase.find({},{
        '_id': 0,
        '__v': 0
    }).sort({ flightNumber: 1}).skip(skip).limit(limit);
}
async function saveLaunch(launch) {
    
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber   
    }, launch, {
        upsert: true
    }) 
    
}
async function scheduleNewLaunch(launch) {
    const foundPlanet = await planets.findOne({keplerName: launch.target});
    if (!foundPlanet) {
        console.log(launch);
      throw new Error('No matching planet was found');  
    }
    const latestFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch,{
        success: true,
         customers: ['Zero To Mastery', 'NASA'],
         upcoming: true,
         flightNumber: latestFlightNumber
    });
    
    return await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });
    return aborted.modifiedCount === 1;
}
module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    existsLaunchWithId
}