const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const launchesSchema = new Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: String
    },
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
    customers: {
        type: [String], // An array of strings
        default: []
    } 
});
// connects launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch',launchesSchema);