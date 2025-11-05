import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      setFeaturedProperties(data);
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Categories />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground text-lg">
                Handpicked properties just for you
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden md:flex">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProperties.map((property) => (
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
          
          <div className="text-center md:hidden">
            <Link to="/properties">
              <Button className="w-full max-w-md">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Home Heaven. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
