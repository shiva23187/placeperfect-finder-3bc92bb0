import { useState } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const mockProperties = [
  {
    id: "1",
    image: property1,
    title: "Modern Luxury Apartment",
    price: "$1,850,000",
    location: "Downtown, New York",
    beds: 3,
    baths: 2,
    sqft: 2400,
    type: "Apartment",
  },
  {
    id: "2",
    image: property2,
    title: "Elegant Family House",
    price: "$3,200,000",
    location: "Beverly Hills, CA",
    beds: 5,
    baths: 4,
    sqft: 4500,
    type: "House",
  },
  {
    id: "3",
    image: property3,
    title: "Premium Commercial Shop",
    price: "$950,000",
    location: "5th Avenue, Manhattan",
    sqft: 1800,
    type: "Shop",
  },
  {
    id: "4",
    image: property4,
    title: "Luxury Hotel Lobby",
    price: "$12,500,000",
    location: "Miami Beach, FL",
    sqft: 15000,
    type: "Hotel",
  },
  {
    id: "5",
    image: property1,
    title: "Penthouse Suite",
    price: "$2,750,000",
    location: "Chicago, IL",
    beds: 4,
    baths: 3,
    sqft: 3200,
    type: "Apartment",
  },
  {
    id: "6",
    image: property2,
    title: "Suburban Villa",
    price: "$1,650,000",
    location: "Austin, TX",
    beds: 4,
    baths: 3,
    sqft: 3500,
    type: "House",
  },
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Properties For Sale</h1>
          <p className="text-muted-foreground">
            {mockProperties.length} properties available
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by location or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
            </div>
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-12">
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
