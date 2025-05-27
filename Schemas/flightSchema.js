const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: String, 
    hostID: String,
    departure: String,
    destination: String, 
    flightRoute: String, 
    date: Date, 
    seatsRemaining: String, 
    pilotID: String, 
    status: String, 
    passengers: [{
        robloxID: String,
        discordID: String, 
        flight_class: String,
        firestoneID: String, 
        seatNumber: String,
        checkedIn: Boolean, 
        confirmedCheckIn: Boolean, 
        bookingReferenceNumber: String,
    }], 
    seats: [{
        seatNumber: String,
        seatType: String, 
        seatColor: String,
        seatCoordinates: Array, 
    }], 
}); 

const FlightModel = mongoose.model('FlightModel', flightSchema);

module.exports = FlightModel; 