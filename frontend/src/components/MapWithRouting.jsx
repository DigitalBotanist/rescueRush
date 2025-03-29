import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useVehicleContext } from "../hooks/useVehicleContext";
import vehicleImage from "/assets/ambulance_icon.png";

// Fix Leaflet default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const vehicleIcon = new L.Icon({
    iconUrl: vehicleImage, 
    iconSize: [40, 28], 
    iconAnchor: [20, 40], // Position the icon properly
    popupAnchor: [0, -40], // Adjust popup position
});


const MapWithRouting = () => {
    const { location, currentEmergency } = useVehicleContext(); // get location
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);
    const vehicleMarkerRef = useRef(null);
    const [currentPosition, setCurrentPosition] = useState(
        location ? [location.lat, location.lng] : [0, 0]
    );
    const [eta, setEta] = useState(null);
    const [distance, setDistance] = useState(null);

    const patientLocation = [currentEmergency.location.coordinates[0], currentEmergency.location.coordinates[1]]
    useEffect(() => {
        console.log(location);
        if (location) {
            setCurrentPosition([location.lat, location.lng]);
        }

        console.log(eta)
    }, [location]);

    useEffect(() => {
        if (location) {
            setCurrentPosition([location.lat, location.lng]);
        }
        // Initialize the map
        if (!mapRef.current) {
            mapRef.current = L.map("map", {
                center: [currentPosition[0], currentPosition[1] - 0.005],
                zoom: 16,
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
                    L.latLng(currentPosition[0], currentPosition[1]), // current position
                    L.latLng(patientLocation[1], patientLocation[0]), // end point 
                ],
                routeWhileDragging: true,
                lineOptions: {
                    styles: [{ color: "blue", weight: 4 }, {color: "red", weight:3}],
                },
                show: true, // Show instructions
                addWaypoints: true,
                draggableWaypoints: true,
                showAlternatives: true
            }).addTo(mapRef.current);
        }

        routingControlRef.current.on("routesfound", (e) => {
            console.log(e.routes)
            const route = e.routes[0]; // Get the first route
            const totalDistance = route.summary.totalDistance / 1000; // Convert meters to km
            const totalTime = route.summary.totalTime / 60; // Convert seconds to minutes

            setDistance(totalDistance.toFixed(2)); // Round to 2 decimal places
            setEta(totalTime.toFixed(0)); // Round to whole minutes
        });

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

        mapRef.current.panTo(currentPosition);
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
