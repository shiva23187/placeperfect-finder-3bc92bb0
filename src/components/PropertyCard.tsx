import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Maximize, Heart, Star } from "lucide-react";
import ShareButton from "./ShareButton";
import { toast } from "@/hooks/use-toast";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  location: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  type: string;
  listingType: string;
}

const PropertyCard = ({
  id,
  image,
  title,
  price,
  location,
  beds,
  baths,
  sqft,
  type,
  listingType,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    checkFavorite();
    fetchRating();
  }, [id]);

  const checkFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("property_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    setIsFavorite(!!data);
  };

  const fetchRating = async () => {
    const { data } = await supabase
      .from("ratings")
      .select("rating")
      .eq("property_id", id);

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to add favorites",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("property_id", id)
          .eq("user_id", user.id);
        
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from("favorites")
          .insert({ property_id: id, user_id: user.id });
        
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <Link to={`/property/${id}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={toggleFavorite}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </Button>
        {averageRating > 0 && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <Badge className="bg-primary">{type}</Badge>
          <Badge variant="secondary">
            For {listingType === "sale" ? "Sale" : "Rent"}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <ShareButton
            propertyId={id}
            propertyTitle={title}
          />
        </div>
      </div>
      <CardContent className="p-5">
        <Link to={`/property/${id}`}>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        {(beds || baths || sqft) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {beds && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{beds} beds</span>
              </div>
            )}
            {baths && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{baths} baths</span>
              </div>
            )}
            {sqft && (
              <div className="flex items-center">
                <Maximize className="h-4 w-4 mr-1" />
                <span>{sqft} sqft</span>
              </div>
            )}
          </div>
        )}
        <div className="text-2xl font-bold text-primary">{formatPrice(price)}</div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
