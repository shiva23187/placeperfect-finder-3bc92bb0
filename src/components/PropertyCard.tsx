import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
  location: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  type: string;
  listingType: "sale" | "rent";
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
  const [isFavorite, setIsFavorite] = useState(false);

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
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-primary">{type}</Badge>
          <Badge variant={listingType === "sale" ? "default" : "secondary"}>
            For {listingType === "sale" ? "Sale" : "Rent"}
          </Badge>
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
                <Square className="h-4 w-4 mr-1" />
                <span>{sqft} sqft</span>
              </div>
            )}
          </div>
        )}
        <div className="text-2xl font-bold text-primary">{price}</div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
