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
  // For Sale Properties
  {
    id: "1",
    image: property1,
    title: "Modern Luxury Apartment",
    price: "₹1.8 Cr",
    location: "Bandra West, Mumbai",
    beds: 3,
    baths: 2,
    sqft: 2400,
    type: "Apartment",
    listingType: "sale" as const,
  },
  {
    id: "2",
    image: property2,
    title: "Elegant Family House",
    price: "₹3.5 Cr",
    location: "Jubilee Hills, Hyderabad",
    beds: 5,
    baths: 4,
    sqft: 4500,
    type: "House",
    listingType: "sale" as const,
  },
  {
    id: "3",
    image: property3,
    title: "Premium Commercial Shop",
    price: "₹95 Lakh",
    location: "Connaught Place, New Delhi",
    sqft: 1800,
    type: "Shop",
    listingType: "sale" as const,
  },
  {
    id: "4",
    image: property4,
    title: "Luxury Hotel Property",
    price: "₹12 Cr",
    location: "MG Road, Bangalore",
    sqft: 15000,
    type: "Hotel",
    listingType: "sale" as const,
  },
  {
    id: "5",
    image: property1,
    title: "Penthouse Suite",
    price: "₹2.5 Cr",
    location: "Lower Parel, Mumbai",
    beds: 4,
    baths: 3,
    sqft: 3200,
    type: "Apartment",
    listingType: "sale" as const,
  },
  {
    id: "6",
    image: property2,
    title: "Luxury Villa",
    price: "₹2.8 Cr",
    location: "Whitefield, Bangalore",
    beds: 4,
    baths: 3,
    sqft: 3500,
    type: "House",
    listingType: "sale" as const,
  },
  // For Rent Properties
  {
    id: "7",
    image: property1,
    title: "Spacious 3BHK Apartment",
    price: "₹85,000/month",
    location: "Powai, Mumbai",
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    listingType: "rent" as const,
  },
  {
    id: "8",
    image: property2,
    title: "Beautiful Independent House",
    price: "₹1.2 Lakh/month",
    location: "Banjara Hills, Hyderabad",
    beds: 4,
    baths: 3,
    sqft: 3000,
    type: "House",
    listingType: "rent" as const,
  },
  {
    id: "9",
    image: property3,
    title: "Commercial Shop Space",
    price: "₹50,000/month",
    location: "Indiranagar, Bangalore",
    sqft: 1200,
    type: "Shop",
    listingType: "rent" as const,
  },
  {
    id: "10",
    image: property1,
    title: "Cozy 2BHK Flat",
    price: "₹45,000/month",
    location: "Koramangala, Bangalore",
    beds: 2,
    baths: 2,
    sqft: 1400,
    type: "Apartment",
    listingType: "rent" as const,
  },
  {
    id: "11",
    image: property2,
    title: "Modern Villa for Rent",
    price: "₹1.5 Lakh/month",
    location: "Gachibowli, Hyderabad",
    beds: 4,
    baths: 4,
    sqft: 3500,
    type: "House",
    listingType: "rent" as const,
  },
  {
    id: "12",
    image: property3,
    title: "Prime Location Shop",
    price: "₹75,000/month",
    location: "Saket, New Delhi",
    sqft: 1500,
    type: "Shop",
    listingType: "rent" as const,
  },
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");

  const filteredProperties = mockProperties.filter((property) => {
    if (listingType !== "all" && property.listingType !== listingType) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Properties {listingType === "all" ? "For Sale & Rent" : listingType === "sale" ? "For Sale" : "For Rent"}
          </h1>
          <p className="text-muted-foreground">
            {filteredProperties.length} properties available
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={listingType === "all" ? "default" : "outline"}
            onClick={() => setListingType("all")}
          >
            All
          </Button>
          <Button
            variant={listingType === "sale" ? "default" : "outline"}
            onClick={() => setListingType("sale")}
          >
            For Sale
          </Button>
          <Button
            variant={listingType === "rent" ? "default" : "outline"}
            onClick={() => setListingType("rent")}
          >
            For Rent
          </Button>
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
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
