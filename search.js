import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search as SearchIcon, MapPin, Star, SlidersHorizontal, Map, List, Shield
} from "lucide-react";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Search() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  
  const [searchQuery, setSearchQuery] = useState(urlParams.get('query') || '');
  const [location, setLocation] = useState(urlParams.get('location') || 'BMSIT College');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [priceRange, setPriceRange] = useState([3000, 15000]);
  const [genderFilter, setGenderFilter] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [sharingType, setSharingType] = useState('all');
  const [radiusFilter, setRadiusFilter] = useState(5);

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list('-rating'),
    initialData: [],
  });

  // Filter properties based on location and other filters
  const filteredProperties = properties.filter(property => {
    const locationMatch = property.landmark?.toLowerCase().includes(location.toLowerCase()) || 
                          property.area?.toLowerCase().includes(location.toLowerCase()) ||
                          property.city?.toLowerCase().includes(location.toLowerCase());
    
    const priceMatch = (property.rent_single >= priceRange[0] && property.rent_single <= priceRange[1]) ||
                       (property.rent_double >= priceRange[0] && property.rent_double <= priceRange[1]) ||
                       (property.rent_triple >= priceRange[0] && property.rent_triple <= priceRange[1]);
    
    const genderMatch = genderFilter === 'all' || property.gender_type === genderFilter;
    const typeMatch = propertyType === 'all' || property.property_type === propertyType;
    const radiusMatch = !property.distance_from_landmark || property.distance_from_landmark <= radiusFilter;
    
    return locationMatch && priceMatch && genderMatch && typeMatch && radiusMatch;
  });

  // Get center coordinates for map
  const centerCoords = filteredProperties[0] ? 
    [filteredProperties[0].latitude, filteredProperties[0].longitude] : 
    [12.9408, 77.5385]; // Default to BMSIT

  return (
    <div className="h-screen flex flex-col">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="icon"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                size="icon"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="co-living">Co-Living</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pg">PG</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Radius: {radiusFilter}km</label>
                <Slider
                  value={[radiusFilter]}
                  onValueChange={(val) => setRadiusFilter(val[0])}
                  min={1}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={2000}
                  max={20000}
                  step={500}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>{filteredProperties.length} properties found</span>
            <Select defaultValue="-rating">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-rating">Top Rated</SelectItem>
                <SelectItem value="rent_single">Price: Low to High</SelectItem>
                <SelectItem value="-rent_single">Price: High to Low</SelectItem>
                <SelectItem value="distance_from_landmark">Nearest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card 
                  key={property.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
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
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{property.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{property.area} • {property.distance_from_landmark}km</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{property.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{property.gender_type}</Badge>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xl font-bold text-orange-600">₹{property.rent_double || property.rent_single}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full">
            <MapContainer 
              center={centerCoords} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredProperties.map((property) => (
                property.latitude && property.longitude && (
                  <Marker 
                    key={property.id}
                    position={[property.latitude, property.longitude]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold mb-1">{property.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{property.area}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{property.rating}</span>
                        </div>
                        <p className="text-orange-600 font-bold mb-2">₹{property.rent_double || property.rent_single}/mo</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => navigate(${createPageUrl("PropertyDetails")}?id=${property.id})}
                        >
                          View Details
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
