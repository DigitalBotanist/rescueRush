import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
  } from 'react-leaflet';
  import { useState, useRef } from 'react';
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  
  // Fix default marker icon issue in Leaflet (common in Vite, React)
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  });
  
  const LocationMarker = ({ position, setPosition, setLocation }) => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLocation(e.latlng);
      },
    });
  
    return position ? (
      <Marker position={position}>
        <Popup>
          Lat: {position.lat.toFixed(5)} <br />
          Lng: {position.lng.toFixed(5)}
        </Popup>
      </Marker>
    ) : null;
  };
  
  const SearchBox = ({ setPosition, setLocation }) => {
    const inputRef = useRef();
    const map = useMap();
  
    const handleSearch = async () => {
      const query = inputRef.current.value;
      if (!query) return;
  
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
  
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
          map.flyTo(coords, 13);
          setPosition(coords);
          setLocation(coords);
        } else {
          alert('Location not found');
        }
      } catch (err) {
        console.error('Search failed:', err);
        alert('Error while searching');
      }
    };
  
    return (
      <div className='w-3/5 p-3 bg-white z-1000 absolute top-5 left-1/2 rounded-2xl -translate-x-1/2 flex gap-2 shadow'>
        <input
          ref={inputRef}
          type="text"
          className='grow border border-gray-300 px-3 py-2 rounded-md'
          placeholder="Search location..."
        />
        <button
          onClick={handleSearch}
          className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
        >
          Search
        </button>
      </div>
    );
  };
  
  const LocationSelectionMap = ({ setLocation }) => {
    const [position, setPosition] = useState(null);
  
    return (
      <div className='h-full w-full relative'>
        <MapContainer
          center={[7.8731, 80.7718]} // Sri Lanka center by default
          zoom={8}
          className='w-full h-full rounded-2xl'
        >
          <SearchBox setPosition={setPosition} setLocation={setLocation} />
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} setLocation={setLocation} />
        </MapContainer>
      </div>
    );
  };
  
  export default LocationSelectionMap;
  