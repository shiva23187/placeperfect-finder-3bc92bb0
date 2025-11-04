import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-center">About Home Heaven</h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Your trusted partner in finding the perfect property
          </p>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground leading-relaxed">
              Home Heaven is a modern real estate platform dedicated to connecting property seekers
              with their dream spaces. Whether you're looking for a cozy apartment, a spacious family
              home, a commercial shop, or a luxury hotel, we have something for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground">
                  To simplify property search and make finding your perfect place effortless
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Our Community</h3>
                <p className="text-sm text-muted-foreground">
                  Over 10,000+ satisfied customers have found their dream properties with us
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Our Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Award-winning platform recognized for outstanding service and innovation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
