import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { toast } from "@/hooks/use-toast";

interface Property {
  id: string;
  image_url: string;
  title: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  category: string;
  listing_type: string;
}

const Favorites = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to view your favorites",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      fetchFavorites(user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchFavorites = async (userId: string) => {
    try {
      const { data: favorites, error } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", userId);

      if (error) throw error;

      if (favorites && favorites.length > 0) {
        const propertyIds = favorites.map(f => f.property_id);
        
        const { data: propertiesData, error: propsError } = await supabase
          .from("properties")
          .select("*")
          .in("id", propertyIds);

        if (propsError) throw propsError;

        setProperties(propertiesData || []);
      }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorite Properties</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No favorite properties yet</p>
            <p className="text-sm text-muted-foreground mt-2">Start adding properties to your favorites!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.image_url || "/placeholder.svg"}
                title={property.title}
                price={property.price}
                location={property.location}
                beds={property.bedrooms}
                baths={property.bathrooms}
                sqft={property.area}
                type={property.category}
                listingType={property.listing_type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
