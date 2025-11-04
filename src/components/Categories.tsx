import { Home, Building2, Store, Hotel, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const categories = [
  { icon: Home, label: "Houses", count: "120+ Properties", color: "bg-blue-500" },
  { icon: Building2, label: "Apartments", count: "85+ Properties", color: "bg-primary" },
  { icon: Store, label: "Shops", count: "45+ Properties", color: "bg-orange-500" },
  { icon: Hotel, label: "Hotels", count: "30+ Properties", color: "bg-purple-500" },
  { icon: TreePine, label: "Playgrounds", count: "20+ Properties", color: "bg-green-600" },
];

const Categories = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find the perfect property type for your needs
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.label} to={`/properties?type=${category.label.toLowerCase()}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.label}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
