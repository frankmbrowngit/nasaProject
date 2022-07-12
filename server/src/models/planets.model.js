const { parse } = require("csv-parse");
const fs = require("fs");
const path = require('path');
const planets = require('./planets.mongo.js');

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
    .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
            savePlanet(data);
        }
    })
    .on("error", (error) => reject(error))
    .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found`);
        resolve();
    }))
}

// const stream2 = parse(stream); // parse returns an event emitter
async function getAllPlanets() { // loading function
    const ret = await planets.find({},{
        '_id': 0,
        '__v': 0
    }); 
    return ret;
}

async function savePlanet(planet) {
     // insert + update = upsert; upsert is basically an insert, but inserts only when object doesn't already exist
            // TODO: replace create with upsert
            try {
                await planets.updateOne({
                    keplerName: planet.kepler_name,
                },{
                    keplerName: planet.kepler_name
                },{
                    upsert: true   
                }); // planet will only be added if it doesn't already exist
                // await planets.create({
                //     keplerName: data.kepler_name
                // });
            } catch (error) {
                console.error(`Could not save planet ${error}`);
            }
}

// stream.on('readable')
module.exports = { 
    getAllPlanets,
    loadPlanetsData 
};
