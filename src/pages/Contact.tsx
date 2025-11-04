import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            We'd love to hear from you. Get in touch with our team.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">info@homeheaven.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Office</h3>
                <p className="text-sm text-muted-foreground">New York, NY</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder="Your Email" />
                </div>
                <Input placeholder="Subject" />
                <Textarea
                  placeholder="Your Message"
                  className="min-h-[150px]"
                />
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Send Message
                  </Button>
                  <Button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex-1 bg-[#25D366] hover:bg-[#20BA5A]"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
