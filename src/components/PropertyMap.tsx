import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

const PropertyMap = ({ latitude, longitude, title, location }: PropertyMapProps) => {
  const position: LatLngExpression = [latitude, longitude];
  
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{title}</p>
              <p className="text-muted-foreground">{location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
