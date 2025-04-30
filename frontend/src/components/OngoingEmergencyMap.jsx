import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";
import { useVehicleContext } from "../hooks/useVehicleContext";

const OngoingEmergencyMap = ({
    destinationPosition,
    routeIndex,
    noOfRoutes,
    setNoOfRoutes,
}) => {
    const { location } = useVehicleContext();
    const mapRef = useRef(null);
    const routingRef = useRef(null);
    const lineOneRef = useRef(null);
    const lineTwoRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = L.map("map");

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        routingRef.current = L.Routing.control({
            lineOptions: {
                addWaypoints: false,
                styles: [], // Avoid drawing anything
            },
        }).addTo(mapRef.current);

        routingRef.current.on("routesfound", (e) => {
            const routes = e.routes;
            setNoOfRoutes(routes.length); // set no of routes

            removeRouteLines(); // remove all the route lines

            lineOneRef.current = new L.Routing.Line(routes[0], {
                styles: [{ color: "blue", weight: 5 }],
                addWaypoints: false,
                routeWhileDragging: false,
            });

            if (routes.length > 1) {
                lineTwoRef.current = new L.Routing.Line(routes[1], {
                    styles: [{ color: "blue", weight: 5 }],
                    addWaypoints: false,
                    routeWhileDragging: false,
                });
            }

            displayRoute();
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // update the current location marker when location updates
    useEffect(() => {
        if (!location) return;
        // set current location
        mapRef.current.setView(L.latLng(location.lat, location.lng), 18);

        if (!destinationPosition) return;
        routingRef.current.setWaypoints([
            L.latLng(location.lat, location.lng),
            L.latLng(destinationPosition.lat, destinationPosition.lng),
        ]);
    }, [location]);

    useEffect(() => {
        if (!routingRef || !destinationPosition) return;
        if (!location) return;

        const waypoints = routingRef.current.getWaypoints();
        if (waypoints.length < 2) {
            routingRef.current.setWaypoints([
                L.latLng(location.lat, location.lng),
                L.latLng(destinationPosition.lat, destinationPosition.lng),
            ]);
        }

        routingRef.current.setWaypoints([
            L.latLng(location.lat, location.lng),
            L.latLng(destinationPosition.lat, destinationPosition.lng),
        ]);

        // routingRef.current.spliceWaypoints(0, 1, L.latLng(destinationPosition.lat, destinationPosition.lng))
    }, [destinationPosition]);

    useEffect(() => {
        if (!routingRef) return;

        displayRoute();
    }, [routeIndex]);

    const displayRoute = () => {
        if (!mapRef.current) return;

        removeRouteLines();

        if (noOfRoutes === 1) {
            if (
                lineOneRef.current &&
                !mapRef.current.hasLayer(lineOneRef.current)
            ) {
                lineOneRef.current.addTo(mapRef.current);
            }

            return;
        }

        if (routeIndex === 0) {
            if (
                lineOneRef.current &&
                !mapRef.current.hasLayer(lineOneRef.current)
            ) {
                lineOneRef.current.addTo(mapRef.current);
            }
        } else {
            if (
                lineTwoRef.current &&
                !mapRef.current.hasLayer(lineTwoRef.current)
            ) {
                lineTwoRef.current.addTo(mapRef.current);
            }
        }
    };

    const removeRouteLines = () => {
        if (noOfRoutes < 2) {
            if (
                lineOneRef.current &&
                mapRef.current.hasLayer(lineOneRef.current)
            ) {
                lineOneRef.current.remove();
            }
            return;
        }
        if (lineOneRef.current && mapRef.current.hasLayer(lineOneRef.current)) {
            lineOneRef.current.remove();
        }

        if (lineTwoRef.current && mapRef.current.hasLayer(lineTwoRef.current)) {
            lineTwoRef.current.remove();
        }
    };

    return (
        <div className="h-full w-full">
            <div id="map" className="h-full w-full"></div>
        </div>
    );
};

export default OngoingEmergencyMap;
