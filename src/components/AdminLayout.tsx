
import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logout, getAuthState } from "@/lib/auth";
import { Box, FileText, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: "products" | "contracts" | "users";
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    total: 0,
    individual: 0,
    corporate: 0,
    admin: 0
  });
  
  // Fetch user stats from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("subscribepro_users");
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        setUserStats({
          total: users.length,
          individual: users.filter((u: any) => u.role === "individual").length,
          corporate: users.filter((u: any) => u.role === "corporate").length,
          admin: users.filter((u: any) => u.role === "admin").length
        });
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
      }
    }
  }, []);
  
  const handleTabChange = (value: string) => {
    switch (value) {
      case "products":
        navigate("/admin");
        break;
      case "contracts":
        navigate("/admin/contracts");
        break;
      case "users":
        navigate("/admin/users");
        break;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <Link to="/dashboard" className="text-2xl font-bold text-subscription-primary">
              SubscribePro <span className="text-sm text-gray-500">Admin</span>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Contracts</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Admin Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-md text-center">Total Users</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-2xl font-bold text-center">{userStats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-md text-center">Individual</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-2xl font-bold text-center">{userStats.individual}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-md text-center">Corporate</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-2xl font-bold text-center">{userStats.corporate}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-md text-center">Admins</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-2xl font-bold text-center">{userStats.admin}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SubscribePro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
