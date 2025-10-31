import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, Star, Phone, Mail, Wifi, UtensilsCrossed, Shield,
  Car, Droplet, Zap, Heart, Share2, ArrowLeft, Eye, MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import PanoramaViewer from "../components/property/PanoramaViewer";
import 'leaflet/dist/leaflet.css';

export default function PropertyDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');
  const [selectedImage, setSelectedImage] = useState(0);
  const [show360, setShow360] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const properties = await base44.entities.Property.list();
      return properties.find(p => p.id === propertyId);
    },
    enabled: !!propertyId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: async () => {
      const allReviews = await base44.entities.Review.list();
      return allReviews.filter(r => r.property_id === propertyId);
    },
    enabled: !!propertyId,
    initialData: [],
  });

  const facilityIcons = {
    'WiFi': Wifi,
    'Food': UtensilsCrossed,
    'Parking': Car,
    'Hot Water': Droplet,
    'Power Backup': Zap,
    'Security': Shield,
  };

  if (isLoading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  const images = property.images || ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 360 Panorama Viewer */}
      {show360 && (
        <PanoramaViewer
          imageUrl={property.virtual_tour_url || images[0]}
          onClose={() => setShow360(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-96 rounded-2xl overflow-hidden group"
          >
            <img
              src={images[selectedImage]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                onClick={() => setShow360(true)}
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 shadow-lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                360° Virtual Tour
              </Button>
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="h-44 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
                onClick={() => setSelectedImage(idx + 1)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Basic Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  {property.verified && (
                    <Badge className="bg-green-500">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 items-center pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{property.rating}</span>
                    <span className="text-gray-600">({property.total_reviews} reviews)</span>
                  </div>
                  <Badge variant="outline" className="text-sm">{property.property_type.toUpperCase()}</Badge>
                  <Badge variant="outline" className="text-sm">{property.gender_type}</Badge>
                  <span className="text-sm text-gray-600">{property.distance_from_landmark}km from {property.landmark}</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Pricing</h2>
                <div className="grid grid-cols-3 gap-4">
                  {property.rent_single && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Single</p>
                      <p className="text-2xl font-bold text-orange-600">₹{property.rent_single}</p>
                    </div>
                  )}
                  {property.rent_double && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Double</p>
                      <p className="text-2xl font-bold text-orange-600">₹{property.rent_double}</p>
                    </div>
                  )}
                  {property.rent_triple && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Triple</p>
                      <p className="text-2xl font-bold text-orange-600">₹{property.rent_triple}</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-3">Security Deposit: ₹{property.deposit}</p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">About this property</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Facilities & Rules */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="facilities">
                  <TabsList className="mb-4">
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="facilities">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.facilities?.map(facility => {
                        const Icon = facilityIcons[facility] || Wifi;
                        return (
                          <div key={facility} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Icon className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-medium">{facility}</span>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rules">
                    <ul className="space-y-2">
                      {property.rules?.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Reviews from Tenants</h2>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-orange-500 text-white">
                              {review.user_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{review.user_name}</p>
                            <p className="text-sm text-gray-600">Stayed for {review.stay_duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="font-medium mb-1">{review.title}</p>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {property.latitude && property.longitude && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[property.latitude, property.longitude]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[property.latitude, property.longitude]} />
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Contact Owner</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{property.owner_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-sm">{property.owner_email}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Owner
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Tenants
                </Button>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Availability</h3>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{property.available_rooms}</p>
                  <p className="text-sm text-gray-600">Rooms Available</p>
                </div>
                <p className="text-sm text-gray-600 mt-3">Out of {property.total_rooms} total rooms</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
