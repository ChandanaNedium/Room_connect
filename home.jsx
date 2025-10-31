import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, MapPin, Star, Users, Wifi, UtensilsCrossed, 
  Shield, TrendingUp, Building2, Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("BMSIT College");

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list('-rating'),
    initialData: [],
  });

  const featuredProperties = properties.filter(p => p.verified && p.rating >= 4.5).slice(0, 6);

  const handleSearch = () => {
    navigate(${createPageUrl("Search")}?location=${encodeURIComponent(location)}&query=${encodeURIComponent(searchQuery)});
  };

  const stats = [
    { icon: Building2, label: "Properties", value: "500+", color: "orange" },
    { icon: Users, label: "Happy Students", value: "2000+", color: "blue" },
    { icon: Shield, label: "Verified PGs", value: "300+", color: "green" },
    { icon: Star, label: "Avg Rating", value: "4.5", color: "yellow" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200')] bg-cover bg-center opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="block bg-white text-transparent bg-clip-text mt-2">
                PG & Hostel Stay
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto">
              Connect with verified accommodations, chat with tenants, and explore rooms virtually
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mt-10">
              <Card className="border-none shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Enter location (e.g., BMSIT College, Mysore Palace)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 h-12 text-lg"
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 h-12 px-8"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-50" onClick={() => setLocation("BMSIT College")}>
                      BMSIT College
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-50" onClick={() => setLocation("Mysore Palace")}>
                      Mysore Palace
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-50" onClick={() => setLocation("Banashankari")}>
                      Banashankari
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#FFFBF5"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={w-12 h-12 mx-auto mb-3 bg-${stat.color}-100 rounded-xl flex items-center justify-center}>
                      <stat.icon className={w-6 h-6 text-${stat.color}-600} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Top-rated and verified accommodations</p>
            </div>
            <Button variant="outline" onClick={() => navigate(createPageUrl("Search"))}>
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(${createPageUrl("PropertyDetails")}?id=${property.id})}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'} 
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {property.verified && (
                      <Badge className="absolute top-3 right-3 bg-green-500">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <button className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{property.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{property.area}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{property.rating}</span>
                        <span className="text-gray-500 text-sm">({property.total_reviews})</span>
                      </div>
                      <Badge variant="outline">{property.gender_type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.facilities?.slice(0, 3).map(facility => (
                        <Badge key={facility} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-2xl font-bold text-orange-600">₹{property.rent_double || property.rent_single}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose Room Connect?</h2>
            <p className="text-gray-600">Your trusted platform for finding the perfect stay</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                description: "All properties are verified for authenticity and safety",
                color: "green"
              },
              {
                icon: Users,
                title: "Chat with Tenants",
                description: "Connect directly with current tenants to get real reviews",
                color: "blue"
              },
              {
                icon: TrendingUp,
                title: "360° Virtual Tours",
                description: "Explore rooms virtually before visiting in person",
                color: "purple"
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Card className="text-center p-8 hover:shadow-xl transition-shadow h-full">
                  <div className={w-16 h-16 mx-auto mb-4 bg-${feature.color}-100 rounded-2xl flex items-center justify-center}>
                    <feature.icon className={w-8 h-8 text-${feature.color}-600} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Room?</h2>
          <p className="text-xl mb-8 text-orange-100">Join thousands of students and professionals who found their ideal stay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => navigate(createPageUrl("Search"))}
            >
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate(createPageUrl("Roommates"))}
            >
              <Users className="w-5 h-5 mr-2" />
              Find Roommates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
