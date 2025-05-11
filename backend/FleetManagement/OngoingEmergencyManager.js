import OngoingEmergency from "./OngoingEmergency.js";

// manage all the ongoing Emergencies
class OngoingEmergencyManager {
    constructor(fleetManager) {
        this.fleetManager = fleetManager;
        this.ongoingEmergencies = new Map(); // access each ongoingEmergency with the emergencyId
    }

    // add a new ongoing emergency
    async addEmergency(emergency, nearbyVehicleList) {
        this.ongoingEmergencies.set(
            emergency._id.toString(),
            new OngoingEmergency(emergency, nearbyVehicleList)
        );
    }

    // returns the next vehicle id to the patient in the nearVehicleList
    nextNearVehicleId(emergencyId) {
        return this.ongoingEmergencies
            .get(emergencyId.toString())
            .getNextNearVehicleId();
    }

    // add requested vehicle to the OngoingEmergency
    addRequestedVehicle(emergencyId, vehicleId) {
        // check if the emergency exists in the ongoing emergency list
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found");
        }

        const emergency = this.ongoingEmergencies.get(emergencyId.toString());

        emergency.addRequestedVehicle(vehicleId);
    }

    // assign vehicle to a patient of the emergency
    // or if all patients have a vehicle, send a cancel message to the other vehicles
    async handleAcceptEmergency(emergencyId, vehicleId, paramedicId) {
        // check if the emergency exists in the ongoing emergency list
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found");
        }

        const emergency = this.ongoingEmergencies.get(emergencyId.toString());

        // assign vehicle to a patient
        const patient = await emergency.assignVehicle(vehicleId);

        // if all patients have a vehicle
        // send a cancel message to rest of the requested vehicles
        if (emergency.isAssigned()) {
            const otherVehicleIds = emergency.getPendingVehicles();
            for (const vehicleId of otherVehicleIds) {
                this.fleetManager.sendCancelMessage(vehicleId, emergency.id);
                emergency.cancelVehicleRequest(vehicleId);
            }
        }

        try {
            const response = await fetch(
                `http://localhost:${process.env.PORT}/api/patients/new_patient`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emergencyId,
                        patient,
                        paramedicId,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error("404 can't send patient data to paramedic");
            }
        } catch (error) {
            throw new Error(error.message);
        }
        return patient;
    }

    async handlePatientPicked(emergencyId, patientId) {
        // check if the emergency exists in the ongoing emergency list
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found");
        }

        const emergency = this.ongoingEmergencies.get(emergencyId.toString());

        emergency.updatePatientStatus(patientId, "picked");
    }

    async handleRejectEmergency(emergencyId, vehicleId) {
        // check if the emergency exists in the ongoing emergency list
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found");
        }

        const emergency = this.ongoingEmergencies.get(emergencyId.toString());

        emergency.cancelVehicleRequest(vehicleId);
    }

    // add hospital details to a patient
    async addHospitalToPatient(emergencyId, patientId, hospitalId) {
        const emergency = this.getEmergency(emergencyId);
        emergency.addHospital(patientId, hospitalId)
    }

    async handlePatientDropoff(emergencyId, patientId) {
        const emergency = this.getEmergency(emergencyId)

        // update the patient status 
        await emergency.updatePatientStatus(patientId, "done")

        // if one patient remove from the manager 
        if (!emergency.isDone()) {
            return 
        }

        // update emergency status
        emergency.updateStatus("done") 

        // update the manager 
        this.handleDone(emergencyId)
    }
    getCallopId(emergencyId) {
        const emergency = this.getEmergency(emergencyId)    

        return emergency.getCallopId()
    }

    handleDone(emergencyId) {
        this.ongoingEmergencies.delete(emergencyId.toString())
    }

    getEmergency(emergencyId) {
        // check if the emergency exists in the ongoing emergency list
        if (!this.ongoingEmergencies.has(emergencyId.toString())) {
            console.error("Emergency not found");
            throw new Error("Emergency not found");
        }

        return this.ongoingEmergencies.get(emergencyId.toString());
    }


}

export default OngoingEmergencyManager;
