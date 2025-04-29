import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAuthState } from "@/lib/auth";

export function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = getAuthState();

  useEffect(() => {
    // If user is authenticated, redirect them to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="gradient-bg text-white">
        <div className="container py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simplify Subscription Management
          </h1>
          <p className="text-xl max-w-2xl mb-8">
            SubscribePro helps you manage your digital subscriptions, online
            courses, and software licenses in one place.
          </p>
          <div className="flex space-x-4">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              variant="default"
              className="bg-white text-subscription-primary hover:bg-gray-100"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              variant="outline"
              className="bg-white text-subscription-primary hover:bg-gray-100"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Manage Subscriptions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-subscription-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-subscription-primary"
                >
                  <path d="M12 2H2v10h10V2z" />
                  <path d="M12 12h10v10H12V12z" />
                  <circle cx="8" cy="16" r="2" />
                  <path d="M18 22a4 4 0 0 0 0-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Flexible Subscription Options
              </h3>
              <p className="text-gray-600">
                Offer different subscription tiers and customize pricing for
                individual and corporate clients.
              </p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-subscription-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-subscription-primary"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Admin Tools</h3>
              <p className="text-gray-600">
                Comprehensive tools for managing products, contracts, and user
                subscriptions.
              </p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-subscription-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-subscription-primary"
                >
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Simplified Billing</h3>
              <p className="text-gray-600">
                Track invoices, payments, and manage billing history for all
                subscriptions.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gray-50 py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up today and take control of your subscription management.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-subscription-primary hover:bg-subscription-primary/90"
          >
            Create Your Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-subscription-primary mb-4 md:mb-0">
              SubscribePro
            </div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} SubscribePro. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
