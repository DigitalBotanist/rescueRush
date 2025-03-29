import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet CSS
import L from "leaflet";
import { useVehicleContext } from "../hooks/useVehicleContext";
import vehicleImage from "/assets/ambulance_icon.png";

const vehicleIcon = new L.Icon({
    iconUrl: vehicleImage, // Use imported image
    iconSize: [40, 28], // Adjust size as needed
    iconAnchor: [20, 40], // Position the icon properly
    popupAnchor: [0, -40], // Adjust popup position
});

const MapWithMarker = ({ location, isVehicle = false }) => {
    return (
        <div className="h-full">
            <div className="h-full w-full border-none box-border">
                {location && (
                    <MapContainer
                        center={[location.lat, location.lng]}
                        zoom={16} // Set the initial zoom level
                        style={{ height: "100%", width: "100%" }}
                        className="border-none rounded-2xl"
                    >
                        {/* Add a tile layer (OpenStreetMap) */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* if vehicle show the vehicle icon */}
                        {isVehicle ? (
                            <Marker
                                position={[location.lat, location.lng]}
                                icon={vehicleIcon}
                            ></Marker>
                        ) : (
                            <Marker
                                position={[location.lat, location.lng]}
                            ></Marker>
                        )}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default MapWithMarker;
