import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Hero = () => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Find Your Perfect Place with Home Heaven
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Discover houses, apartments, shops, hotels, and more
        </p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search location..."
                className="h-12"
              />
            </div>
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Buy or Rent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="playground">Playground</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-12 bg-primary hover:bg-primary/90">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
