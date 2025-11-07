import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapClickHandler = ({ setLatitude, setLongitude }: { setLatitude: (lat: number) => void; setLongitude: (lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });
  return null;
};

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    category: "",
    listing_type: "",
    description: "",
    image_url: "",
    contact_number: "",
    latitude: 28.6139,
    longitude: 77.2090,
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to edit properties",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    const fetchProperty = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch property details",
          variant: "destructive",
        });
        navigate("/properties");
        return;
      }

      if (data.user_id !== user?.id) {
        toast({
          title: "Access Denied",
          description: "You can only edit your own properties",
          variant: "destructive",
        });
        navigate("/properties");
        return;
      }

      setFormData({
        title: data.title || "",
        price: data.price?.toString() || "",
        location: data.location || "",
        bedrooms: data.bedrooms?.toString() || "",
        bathrooms: data.bathrooms?.toString() || "",
        area: data.area?.toString() || "",
        category: data.category || "",
        listing_type: data.listing_type || "",
        description: data.description || "",
        image_url: data.image_url || "",
        contact_number: data.contact_number || "",
        latitude: data.latitude || 28.6139,
        longitude: data.longitude || 77.2090,
      });
    };

    getUser();
    if (user) {
      fetchProperty();
    }
  }, [id, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("properties")
        .update({
          title: formData.title,
          price: parseFloat(formData.price),
          location: formData.location,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          category: formData.category,
          listing_type: formData.listing_type,
          description: formData.description,
          image_url: formData.image_url,
          contact_number: formData.contact_number,
          latitude: formData.latitude,
          longitude: formData.longitude,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Property updated successfully",
      });

      navigate(`/property/${id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mapCenter: LatLngExpression = [formData.latitude, formData.longitude];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Property Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="3 BHK Luxury Apartment"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="playground">Playground</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Listing Type</label>
              <Select value={formData.listing_type} onValueChange={(value) => setFormData({ ...formData, listing_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price (₹)</label>
            <Input
              required
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="5000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Connaught Place, New Delhi"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <Input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Area (sq ft)</label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="1500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Number</label>
            <Input
              required
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Property description..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location on Map (Click to set)</label>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                placeholder="Latitude"
              />
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                placeholder="Longitude"
              />
            </div>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={mapCenter} />
                <MapClickHandler
                  setLatitude={(lat) => setFormData({ ...formData, latitude: lat })}
                  setLongitude={(lng) => setFormData({ ...formData, longitude: lng })}
                />
              </MapContainer>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Property"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
