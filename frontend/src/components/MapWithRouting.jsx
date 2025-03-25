import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useVehicleContext } from "../hooks/useVehicleContext";

// Fix Leaflet default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapWithRouting = () => {
    const { location } = useVehicleContext(); // get location
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);
    const vehicleMarkerRef = useRef(null);
    const [currentPosition, setCurrentPosition] = useState(
        location ? [location.lat, location.lng] : [0, 0]
    ); 

    useEffect(() => {
        console.log(location);
        if (location) {
            setCurrentPosition([location.lat, location.lng]);
        }
    }, [location]);

    useEffect(() => {
        if (location) {
            setCurrentPosition([location.lat, location.lng]);
        }
        // Initialize the map
        if (!mapRef.current) {
            mapRef.current = L.map("map", {
                center: currentPosition,
                zoom: 15,
            });

            // Add OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapRef.current);

            // Add a marker for the vehicle
            vehicleMarkerRef.current = L.marker(currentPosition, {
                icon: L.icon({
                    iconUrl: markerIcon, // Use imported marker icon
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                }),
            }).addTo(mapRef.current);

            // Add routing control
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(currentPosition[0], currentPosition[1]), // Start point (current position)
                    L.latLng(7.267611, 80.59679), // End point
                ],
                routeWhileDragging: true,
                lineOptions: {
                    styles: [{ color: "blue", weight: 4 }],
                },
                show: true, // Show instructions
                addWaypoints: true,
                draggableWaypoints: true,
            }).addTo(mapRef.current);
        }

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng(currentPosition);
        }

        if (routingControlRef.current) {
            const waypoints = routingControlRef.current.getWaypoints();
            waypoints[0].latLng = L.latLng(
                currentPosition[0],
                currentPosition[1]
            );
            routingControlRef.current.setWaypoints(waypoints);
        }
    }, [currentPosition]);

    // Simulate vehicle movement
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // Simulate a new position
    //         const newLat = currentPosition[0] + 0.001; // Move north
    //         const newLng = currentPosition[1] + 0.001; // Move east
    //         const newPosition = [newLat, newLng];

    //         // Update the vehicle's position
    //         setCurrentPosition(newPosition);

    //         // Move the vehicle marker
    //         if (vehicleMarkerRef.current) {
    //             vehicleMarkerRef.current.setLatLng(newPosition);
    //         }

    //         // Update the routing control's start waypoint
    //         if (routingControlRef.current) {
    //             const waypoints = routingControlRef.current.getWaypoints();
    //             waypoints[0].latLng = L.latLng(newPosition[0], newPosition[1]);
    //             routingControlRef.current.setWaypoints(waypoints);
    //         }
    //     }, 5000); // Update every 5 seconds

    //     // Cleanup interval
    //     return () => clearInterval(interval);
    // }, [currentPosition]);

    return (
        <div className="h-full w-full rounded-2xl">
            <div id="map" className="h-full w-full rounded-2xl" />
        </div>
    );
};

export default MapWithRouting;
