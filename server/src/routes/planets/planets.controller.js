const {getAllPlanets} = require('../../models/planets.model.js');

async function httpGetAllPlanets(req,res) {
    return res.status(200).json(await getAllPlanets()); // Adding a status code is good practice to do for all of your responses
}

module.exports = { httpGetAllPlanets }