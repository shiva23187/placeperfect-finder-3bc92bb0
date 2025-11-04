import { useParams } from "react-router-dom";
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
import property1 from "@/assets/property-1.jpg";

const PropertyDetails = () => {
  const { id } = useParams();

  const property = {
    id: "1",
    image: property1,
    title: "Modern Luxury Apartment",
    price: "$1,850,000",
    location: "Downtown, New York, NY 10001",
    beds: 3,
    baths: 2,
    sqft: 2400,
    type: "Apartment",
    description:
      "Experience luxury living in this stunning modern apartment featuring floor-to-ceiling windows, high-end finishes, and breathtaking city views. The open-concept design seamlessly blends the living, dining, and kitchen areas, creating a perfect space for entertaining.",
    features: [
      "Central Air Conditioning",
      "Floor-to-ceiling windows",
      "Hardwood Floors",
      "Modern Kitchen",
      "Walk-in Closets",
      "Balcony",
      "Building Gym",
      "24/7 Security",
    ],
    ownerName: "John Smith",
    ownerPhone: "+1234567890",
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your property: ${property.title} on Home Heaven.`
    );
    window.open(
      `https://wa.me/${property.ownerPhone}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-primary text-lg py-2 px-4">
                  {property.type}
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
                {property.beds && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{property.beds} Beds</span>
                  </div>
                )}
                {property.baths && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{property.baths} Baths</span>
                  </div>
                )}
                {property.sqft && (
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">{property.sqft} sqft</span>
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                {property.price}
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-muted-foreground"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Property Owner</h3>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Owner</p>
                  <p className="font-semibold text-lg">{property.ownerName}</p>
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
