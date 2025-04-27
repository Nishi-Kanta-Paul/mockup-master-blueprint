
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Billing from "./pages/Billing";
import AdminProducts from "./pages/AdminProducts";
import AdminContracts from "./pages/AdminContracts";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <Index />
            } 
          />
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthGuard requireAuth={false}>
                <Register />
              </AuthGuard>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/products" 
            element={
              <AuthGuard>
                <Products />
              </AuthGuard>
            } 
          />
          <Route 
            path="/products/:productId" 
            element={
              <AuthGuard>
                <ProductDetail />
              </AuthGuard>
            } 
          />
          <Route 
            path="/billing" 
            element={
              <AuthGuard>
                <Billing />
              </AuthGuard>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <AuthGuard requireAuth={true} requireAdmin={true}>
                <AdminProducts />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin/contracts" 
            element={
              <AuthGuard requireAuth={true} requireAdmin={true}>
                <AdminContracts />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AuthGuard requireAuth={true} requireAdmin={true}>
                <AdminUsers />
              </AuthGuard>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
