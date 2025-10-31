import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  Home, Search, Heart, MessageSquare, User, 
  Building2, PlusCircle, Users, LogOut, Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not logged in");
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const navigationItems = [
    { title: "Home", url: createPageUrl("Home"), icon: Home },
    { title: "Search", url: createPageUrl("Search"), icon: Search },
    { title: "Find Roommate", url: createPageUrl("Roommates"), icon: Users },
    { title: "Messages", url: createPageUrl("Messages"), icon: MessageSquare },
    { title: "Saved", url: createPageUrl("Saved"), icon: Heart },
  ];

  const ownerItems = user?.user_type === "owner" ? [
    { title: "My Listings", url: createPageUrl("MyListings"), icon: Building2 },
    { title: "Add Property", url: createPageUrl("AddProperty"), icon: PlusCircle },
  ] : [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Sidebar className="border-r border-orange-100">
          <SidebarHeader className="border-b border-orange-100 p-4 bg-gradient-to-r from-orange-500 to-blue-500">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Room Connect</h2>
                <p className="text-xs text-orange-100">Find Your Perfect Stay</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-orange-50 text-orange-700 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {ownerItems.length > 0 && (
              <SidebarGroup>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Owner Dashboard
                </div>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {ownerItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                            location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-100 p-4">
            {user ? (
              <div className="space-y-3">
                <Link to={createPageUrl("Profile")} className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50 transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-orange-200">
                    <AvatarImage src={user.profile_picture} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-400 text-white">
                      {user.full_name?.[0] || user.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{user.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                onClick={() => base44.auth.redirectToLogin()}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-lg border-b border-orange-100 px-6 py-4 lg:hidden sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="hover:bg-orange-50">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-orange-500" />
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  Room Connect
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
