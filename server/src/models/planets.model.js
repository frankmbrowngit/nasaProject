const { parse } = require("csv-parse");
const fs = require("fs");
const path = require('path');
const results = [];
function isHabitablePlanet(planet) {
    return (
        planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6
    );
}
function loadPlanetsData() {
    return new Promise((resolve,reject) =>
    fs.createReadStream(path.join(__dirname,'..','..',"data","kepler_data.csv"))
    .pipe(
        parse({
            comment: "#",
            columns: true,
        })
    )
    .on("data", (data) => {
        if (isHabitablePlanet(data)) {
            results.push(data);
        }
    })
    .on("error", (error) => reject(error))
    .on("end", () => {
        console.log(`${results.length} habitable planets found`);
        resolve();
    }))
}

// const stream2 = parse(stream); // parse returns an event emitter

// stream.on('readable')
module.exports = { 
    planets: results,
    loadPlanetsData 
};
