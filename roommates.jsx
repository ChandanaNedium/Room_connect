import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, MapPin, DollarSign, Calendar, MessageCircle, Plus, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Roommates() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    gender: 'any',
    occupation: 'student',
    budget_min: 5000,
    budget_max: 10000,
    preferred_location: '',
    preferred_sharing: 'double',
    move_in_date: '',
    lifestyle: [],
    about: '',
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['roommate-requests'],
    queryFn: () => base44.entities.RoommateRequest.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.RoommateRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roommate-requests'] });
      setShowForm(false);
      setFormData({
        user_name: '', user_email: '', gender: 'any', occupation: 'student',
        budget_min: 5000, budget_max: 10000, preferred_location: '',
        preferred_sharing: 'double', move_in_date: '', lifestyle: [], about: '',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, status: 'active' });
  };

  const lifestyleOptions = [
    "Non-smoker", "Vegetarian", "Non-vegetarian", "Early riser", 
    "Night owl", "Fitness enthusiast", "Quiet environment", "Social"
  ];

  const toggleLifestyle = (option) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(option)
        ? prev.lifestyle.filter(l => l !== option)
        : [...prev.lifestyle, option]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Roommate</h1>
            <p className="text-gray-600">Connect with people looking for shared accommodation</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Your Request
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="mb-8 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Create Roommate Request</h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Name *</label>
                        <Input
                          required
                          value={formData.user_name}
                          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input
                          required
                          type="email"
                          value={formData.user_email}
                          onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Gender Preference</label>
                        <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Occupation</label>
                        <Select value={formData.occupation} onValueChange={(val) => setFormData({ ...formData, occupation: val })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Budget Range</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={formData.budget_min}
                            onChange={(e) => setFormData({ ...formData, budget_min: parseInt(e.target.value) })}
                            placeholder="Min"
                          />
                          <Input
                            type="number"
                            value={formData.budget_max}
                            onChange={(e) => setFormData({ ...formData, budget_max: parseInt(e.target.value) })}
                            placeholder="Max"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Preferred Sharing</label>
                        <Select value={formData.preferred_sharing} onValueChange={(val) => setFormData({ ...formData, preferred_sharing: val })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="double">Double Sharing</SelectItem>
                            <SelectItem value="triple">Triple Sharing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Preferred Location</label>
                        <Input
                          value={formData.preferred_location}
                          onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                          placeholder="e.g., Near BMSIT College"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Move-in Date</label>
                        <Input
                          type="date"
                          value={formData.move_in_date}
                          onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Lifestyle Preferences</label>
                      <div className="flex flex-wrap gap-2">
                        {lifestyleOptions.map(option => (
                          <Badge
                            key={option}
                            variant={formData.lifestyle.includes(option) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleLifestyle(option)}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">About You</label>
                      <Textarea
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                        placeholder="Tell potential roommates about yourself..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                      Post Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request, idx) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                          {request.user_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{request.user_name}</h3>
                        <p className="text-sm text-gray-600">{request.occupation}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{request.gender}</Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{request.about}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{request.preferred_location || 'Flexible'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>₹{request.budget_min} - ₹{request.budget_max}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{request.preferred_sharing} sharing</span>
                    </div>
                    {request.move_in_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Move-in: {format(new Date(request.move_in_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {request.lifestyle?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.lifestyle.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
