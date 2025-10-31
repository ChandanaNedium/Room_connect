import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Building2, Save } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    user_type: 'seeker',
    occupation: 'student',
    gender: 'male',
    college_name: '',
    budget_min: 5000,
    budget_max: 10000,
    preferred_location: '',
    preferred_sharing: 'double',
    bio: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        phone: currentUser.phone || '',
        user_type: currentUser.user_type || 'seeker',
        occupation: currentUser.occupation || 'student',
        gender: currentUser.gender || 'male',
        college_name: currentUser.college_name || '',
        budget_min: currentUser.budget_min || 5000,
        budget_max: currentUser.budget_max || 10000,
        preferred_location: currentUser.preferred_location || '',
        preferred_sharing: currentUser.preferred_sharing || 'double',
        bio: currentUser.bio || '',
      });
    };
    loadUser();
  }, []);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200">
            <AvatarImage src={user.profile_picture} />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-400 text-white text-2xl">
              {user.full_name?.[0] || user.email?.[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="pl-10"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">I am a</label>
                  <Select value={formData.user_type} onValueChange={(val) => setFormData({ ...formData, user_type: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeker">Accommodation Seeker</SelectItem>
                      <SelectItem value="owner">Property Owner</SelectItem>
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
                      <SelectItem value="professional">Working Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">College/Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.college_name}
                      onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                      className="pl-10"
                      placeholder="e.g., BMSIT"
                    />
                  </div>
                </div>
              </div>

              {formData.user_type === 'seeker' && (
                <>
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
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                          <SelectItem value="triple">Triple</SelectItem>
                          <SelectItem value="any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Location</label>
                    <Input
                      value={formData.preferred_location}
                      onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                      placeholder="e.g., Near BMSIT College"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                disabled={updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
