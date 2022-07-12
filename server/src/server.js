// Starting our server in this way will allow us to use web sockets later on
// express is really just middleware that we add on to the built in http server
const http = require('http');
const app = require('./app.js');
const { mongooseConnect } = require('./services/mongo.js');


const  { loadPlanetsData } = require('./models/planets.model.js');
const { loadLaunchData } = require('./models/launches.model.js');
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

async function startServer() {
    await mongooseConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT, () => {
        console.log('Listening on PORT:',PORT);
    })
}
startServer();
