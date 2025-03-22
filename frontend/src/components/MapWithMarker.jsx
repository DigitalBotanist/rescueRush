import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet CSS
import { useVehicleContext } from "../hooks/useVehicleContext";

const MapWithMarker = () => {
    // Coordinates for the location (latitude, longitude)
    const { location } = useVehicleContext();

    return (
        <div className="h-full">
            <div className="h-full w-full border-none">
                {location && (
                    <MapContainer
                        center={[location.lat, location.lng]} // Center the map on the coordinates
                        zoom={13} // Set the initial zoom level
                        style={{ height: "100%", width: "100%" }}
                        className="border-none rounded-2xl"
                    >
                        {/* Add a tile layer (OpenStreetMap) */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>This is the location!</Popup>{" "}
                            {/* Optional: Add a popup */}
                        </Marker>
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default MapWithMarker;
