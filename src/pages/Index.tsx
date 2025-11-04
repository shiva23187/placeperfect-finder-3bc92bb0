import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const featuredProperties = [
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
];

const Index = () => {
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
              <PropertyCard key={property.id} {...property} />
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
