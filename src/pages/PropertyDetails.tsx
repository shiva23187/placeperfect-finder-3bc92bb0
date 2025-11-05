import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Share2,
  Heart,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PropertyData {
  id: string;
  image_url: string | null;
  title: string;
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  category: string;
  listing_type: string;
  description: string | null;
  contact_number: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error: any) {
      toast.error("Failed to fetch property details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === "rent") {
      return `₹${price.toLocaleString('en-IN')}/month`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleWhatsAppContact = () => {
    if (!property) return;
    const message = encodeURIComponent(
      `Hi, I'm interested in your property: ${property.title} on Home Heaven.`
    );
    const phoneNumber = property.contact_number.replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <img
                src={property.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
                alt={property.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-primary text-lg py-2 px-4">
                  {property.category}
                </Badge>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="flex items-center gap-6 mb-6">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{property.area} sqft</span>
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                {formatPrice(property.price, property.listing_type)}
              </div>
            </div>

            {property.description && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Property Owner</h3>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  <p className="font-semibold text-lg">{property.contact_number}</p>
                </div>

                <Button
                  className="w-full mb-3 h-12 bg-[#25D366] hover:bg-[#20BA5A]"
                  onClick={handleWhatsAppContact}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact via WhatsApp
                </Button>

                <Button variant="outline" className="w-full h-12">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Email
                </Button>

                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    📍 Visit this property to see it in person. Schedule a
                    viewing today!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
