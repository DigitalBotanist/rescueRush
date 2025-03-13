import Patient from '../shared/models/patientModel.js';

class OngoingEmergency {
    constructor(emergency, nearbyVehicleList) {
        this.id = emergency._id;
        this.emergency = emergency;
        this.status = "pending";
        this.nearbyVehiclesList = nearbyVehicleList;
        this.vehicleRequestStatus = {}

    }

    getNextNearVehicleId() {
        // send the next vehicle id or undefined if there are no vehicles nearby
        return this.nearbyVehiclesList.shift();
    }

    async assignVehicle(vehicleId) {
        const unassignedPatients = this.emergency.patients.filter(
            (p) => !p.vehicle
        );

        // check if there are unassigned patients
        if (!unassignedPatients.length) {
            throw new Error("All patients have been assigned vehicles");
        }

        // assign vehicle to a patient
        const patient = unassignedPatients[0];
        const updatedPatient = await Patient.updateVehicle(patient._id, vehicleId);
        this.emergency.patients.find(p => p._id === patient._id).vehicle = vehicleId
        this.vehicleRequestStatus[vehicleId] = 'assigned'

        if (this.arePatientsAssinged()) this.status = "assigned";
    }

    // check if all patients has a vehicle
    arePatientsAssinged() {
        return this.emergency.patients.filter((p) => !p.vehicle).length === 0;
    }

    // return boolean if all the patients are assigned to a vehicle 
    isAssigned() {
        return this.status == 'assigned'
    }

    addRequestedVehicle(vehicleId) {
        this.vehicleRequestStatus[vehicleId] = 'pending'
    }

    // return pending vehicle list
    getPendingVehicles() {
        return Object.keys(this.vehicleRequestStatus).filter((vehicleId) => this.vehicleRequestStatus[vehicleId] === "pending")
    }

    // cancel vehicle requests
    cancelVehicleRequest(vehicleId) {
        // check if vehicleId is in the vehicleRequestStatus
        if (!this.vehicleRequestStatus[vehicleId]) {
            throw new Error("hasn't send request to vehicle: ", vehicleId)
        }

        // update vehicle request status 
        this.vehicleRequestStatus[vehicleId] = 'cancel'
    }

    getInfo() {
        return {
            id: this.id,
            status: this.status,
            vehicleId: this.vehicleId,
            emergency: this.emergency,
        };
    }
}

export default OngoingEmergency;
