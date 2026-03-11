interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

const PropertyMap = ({ latitude, longitude, title, location }: PropertyMapProps) => {
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <iframe
        title={`Map of ${title} - ${location}`}
        src={mapSrc}
        style={{ height: "100%", width: "100%", border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default PropertyMap;
