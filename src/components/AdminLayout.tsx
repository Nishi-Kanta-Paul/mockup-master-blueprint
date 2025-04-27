
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logout } from "@/lib/auth";
import { Box, FileText, Package, Users } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: "products" | "contracts" | "users";
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const navigate = useNavigate();
  
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
