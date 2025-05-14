import { useState } from "react";
import { useCallopContext } from "../hooks/useCallopContext";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const CallOpOngoingEmergencyMap = () => {
    const { currentEmergency } = useCallopContext();
    const [patientLocation, setPatientLocation] = useState({
        lng: 80.7718,
        lat: 7.8731,
    });

    return (
        <div className="h-full">
            <div className="h-full w-full border-none box-border">
                <MapContainer
                    center={[patientLocation.lat, patientLocation.lng]}
                    zoom={10} // Set the initial zoom level
                    style={{ height: "100%", width: "100%" }}
                    className="border-none rounded-2xl"
                >
                    {/* Add a tile layer (OpenStreetMap) */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* if vehicle show the vehicle icon */}

                    {patientLocation && (
                        <Marker
                            position={[
                                patientLocation.lat,
                                patientLocation.lng,
                            ]}
                        ></Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default CallOpOngoingEmergencyMap;
