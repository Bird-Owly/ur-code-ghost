const FlightModel = require('../Schemas/flightSchema'); 

const flightDataManip = {
    createFlightData: async function(flightDataObject) {

        const flightObject = flightDataObject; // for easier reference 

        const existingFlightData = await FlightModel.findOne({ flightNumber: flightDataObject.number }); 

        if (existingFlightData) {
            throw new Error('Flight already exists');
        }

        seatsNumber = ['1A', '1B', '2A', '2B', '2C'];
        seatTypeArr = ['First Class', 'First Class', 'Economy Class', 'Economy Class', 'Economy Class'];
        seatColorArr = ['Yellow', 'Yellow', 'Green', 'Green', 'Green'];
        seatCoordinatesArr = [[376, 227.8], [540, 227.8], [376, 383.3], [460, 383.3], [540, 383.3]];
        const seatsArr = []

        for (let i = 0; i < seatTypeArr.length; i++) {

            const seat = {
                seatNumber: seatsNumber[i],
                seatType: seatTypeArr[i],
                seatColor: seatColorArr[i],
                seatCoordinates: seatCoordinatesArr[i],
            }; 

            seatsArr.push(seat); 
        }

        const flightData = new FlightModel({
            flightNumber: flightObject.number,
            hostID: flightObject.hostID, 
            departure: flightObject.departure, 
            destination: flightObject.destination,
            flightRoute: flightObject.route,
            date: flightObject.date,
            seatsRemaining: '5', 
            pilotID: flightObject.pilotID,
            status: flightNumber.status, 
            passengers: [],
            seats: seatsArr, 
        });

        try {
            await flightData.save(); 
        } catch(error) {
            throw new Error(`Error saving flight data: ${error}`); 
        }
    },
    addDataPassenger: async function(passengerObj, flightNumber) {

        const findFlight = await FlightModel.findOne({ flightNumber: flightNumber });

        if (!findFlight) {
            throw new Error('No flight found matching the flight number that got passed');
        }

        const passengerDataFinal = {
            robloxID: passengerObj.robloxID,
            discordID: passengerObj.discordID,
            flight_class: passengerObj.flight_class,
            firestoneID: passengerObj.firestoneID,
            seatNumber: passengerObj.seatNumber,
            checkedIn: passengerObj.checkedIn,
            confirmedCheckIn: passengerObj.confirmedCheckIn,
            bookingReferenceNumber: passengerObj.bookingReferenceNumber,
        }; 

        findFlight.passengers.push(passengerDataFinal);

        try {
            await findFlight.save();
        } catch (error) {
            throw new Error(`Error sending passenger data request: ${error}`); 
        }
    }, 
    getFlightData: async function(flightNumber) {

        const findFlight = await FlightModel.findOne({ flightNumber: flightNumber });

        if (!findFlight) {
            throw new Error('No flight found matching the flight number that got passed');
        }
        
        return findFlight; // Return the whole object 
    },
    getPassengerData: async function(robloxID, flightNumber) {
        const findFlightAndUser = await FlightModel.findOne({ flightNumber: flightNumber, 'passengers.robloxID': robloxID }); 

        if (!findFlightAndUser) {
            throw new Error('No flight matching flight ID and attending passenger was ever pinpointed');
        }

        const passengerDataArr = findFlightAndUser.passengers.findIndex(data => data.robloxID === robloxID);
        
        const finalPassengerDataArr = findFlightAndUser.passengers[passengerDataArr];

        return finalPassengerDataArr; 
    },
    UserDataTemplate: class {
        constructor() {

        }

        setRobloxID(robloxID) {
            this.robloxID = robloxID;
        }

        setDiscordID(discordID) {
            this.discordID = discordID;
        }

        setFlightClass(flightClass) {
            this.flight_class = flightClass;
        }

        addBookingReference(bookingReference) {
            this.bookingReferenceNumber = bookingReference; 
        }

        finalizeSystem() {
            this.firestoneID = 'None';
            this.seatNumber = 'None';
            this.checkedIn = false;
            this.confirmedCheckIn = false; 
        }
    },
}; 

module.exports = flightDataManip; 