const mongoose = require('mongoose');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
    path: path.join(__dirname,'..','.env')
})}
mongoose.connection.once('open', () => { // event emitter
    console.log('Mongodb connection ready');
});
mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongooseConnect() {
    await mongoose.connect(process.env.DB_URI);
}
async function mongooseDisconnect() {
    await mongoose.disconnect();
}
module.exports = { mongooseConnect, mongooseDisconnect }