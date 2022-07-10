const {planets} = require('../../models/planets.model.js');

function getAllPlanets(req,res) {
    return res.status(200).json(planets); // Adding a status code is good practice to do for all of your responses
}

module.exports = { getAllPlanets }