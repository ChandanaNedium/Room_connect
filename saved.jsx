import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";

export default function Saved() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">Your favorite PGs and hostels</p>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <Heart className="w-20 h-20 text-gray-300 mb-4" />
          <p className="text-xl font-medium text-gray-500 mb-2">No saved properties yet</p>
          <p className="text-gray-400 mb-6">Start exploring and save your favorite places</p>
          <Button 
            onClick={() => navigate(createPageUrl("Search"))}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Browse Properties
          </Button>
        </div>
      </div>
    </div>
  );
}
