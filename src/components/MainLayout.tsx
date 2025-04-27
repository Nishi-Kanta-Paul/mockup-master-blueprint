
import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuthState, logout, checkIsAdmin } from "@/lib/auth";
import { Menu, X, Home, Package, CreditCard, User, LogOut, Settings, Users } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = getAuthState();
  const isAdmin = checkIsAdmin();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-subscription-primary">
              SubscribePro
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/products">Products</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/billing">Billing</Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-2 relative">
                  <User className="h-5 w-5 mr-2" />
                  <span>{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="container py-2">
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                  <Link to="/dashboard">
                    <Home className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                  <Link to="/products">
                    <Package className="h-5 w-5 mr-2" />
                    Products
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                  <Link to="/billing">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Billing
                  </Link>
                </Button>
              </li>
              {isAdmin && (
                <li>
                  <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                    <Link to="/admin">
                      <Users className="h-5 w-5 mr-2" />
                      Admin
                    </Link>
                  </Button>
                </li>
              )}
              <li>
                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SubscribePro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
