import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Bed, Bath, Maximize, Heart, Mail, Star, Edit, Trash2, MessageSquare, Phone } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import PropertyMap from "@/components/PropertyMap";
import { VisitScheduler } from "@/components/VisitScheduler";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  latitude: number | null;
  longitude: number | null;
  user_id: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    fetchProperty();
    fetchRatings();
    fetchComments();
    checkFavorite();
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

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to add favorites",
        variant: "destructive",
      });
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

  const fetchRatings = async () => {
    const { data: ratingsData } = await supabase
      .from("ratings")
      .select("rating, user_id")
      .eq("property_id", id);

    if (ratingsData && ratingsData.length > 0) {
      const avg = ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length;
      setAverageRating(avg);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userRatingData = ratingsData.find(r => r.user_id === user.id);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
        }
      }
    }
  };

  const handleRating = async (rating: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to rate properties",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("ratings")
        .upsert({ property_id: id, user_id: user.id, rating });

      if (error) throw error;

      setUserRating(rating);
      fetchRatings();
      toast({ title: "Rating submitted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq("property_id", id)
      .order("created_at", { ascending: false });

    setComments(data || []);
  };

  const handleAddComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from("comments")
        .insert({ property_id: id, user_id: user.id, comment: newComment });

      if (error) throw error;

      setNewComment("");
      fetchComments();
      toast({ title: "Comment added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      fetchComments();
      toast({ title: "Comment deleted" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async () => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Property deleted successfully" });
      navigate("/properties");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);

      // Fetch additional images
      const { data: imagesData } = await supabase
        .from("property_images")
        .select("image_url")
        .eq("property_id", id!)
        .order("display_order");

      const allImages = [data.image_url, ...(imagesData?.map(img => img.image_url) || [])].filter(Boolean);
      setPropertyImages(allImages);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch property details",
        variant: "destructive",
      });
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

      <div className="relative">
        {propertyImages.length > 0 && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={propertyImages[currentImageIndex] || "/placeholder.svg"}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {propertyImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 px-4 py-2 rounded-full">
                {propertyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary text-lg py-2 px-4">
            {property.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white hover:bg-white/90"
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <ShareButton
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {user && property.user_id === user.id && (
              <Card className="p-4">
                <div className="flex gap-4">
                  <Link to={`/edit-property/${property.id}`}>
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Property
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Property
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Property</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this property? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProperty}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            )}

            <div>
              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>

              <div className="flex items-center gap-6 mb-4">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 mr-2" />
                    <span>{property.area} sqft</span>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {formatPrice(property.price, property.listing_type)}
              </div>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Rating</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= userRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </Button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">Your rating: {userRating} stars</p>
              )}
            </Card>

            {property.description && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Comments & Reviews
              </h2>
              
              <div className="space-y-4 mb-6">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  rows={3}
                />
                <Button onClick={handleAddComment}>Post Comment</Button>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{comment.profiles?.full_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {user && comment.user_id === user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </Card>
                  ))
                )}
              </div>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              {property.latitude && property.longitude && (
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Location</h2>
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    title={property.title}
                    location={property.location}
                  />
                </Card>
              )}

              <VisitScheduler propertyId={id!} userId={user?.id || null} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
