import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Property {
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
}

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch properties: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    if (listingType !== "all" && property.listing_type !== listingType) {
      return false;
    }
    if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                id={property.id}
                image={property.image_url || ""}
                title={property.title}
                price={formatPrice(property.price, property.listing_type)}
                location={property.location}
                beds={property.bedrooms || undefined}
                baths={property.bathrooms || undefined}
                sqft={property.area || undefined}
                type={property.category}
                listingType={property.listing_type as "sale" | "rent"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
