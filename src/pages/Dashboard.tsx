
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/MainLayout";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { getAuthState } from "@/lib/auth";
import { subscriptions, invoices } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, CreditCard, Package, Clock } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = getAuthState();
  
  // Filter subscriptions for current user
  const userSubscriptions = subscriptions.filter(sub => sub.userId === user?.id);
  
  // Filter invoices for current user's subscriptions
  const userSubscriptionIds = userSubscriptions.map(sub => sub.id);
  const userInvoices = invoices.filter(inv => userSubscriptionIds.includes(inv.subscriptionId));
  
  // Calculate totals
  const totalSpent = userInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const activeSubscriptions = userSubscriptions.length;
  
  // Get upcoming payment
  const upcomingPayments = userSubscriptions
    .map(sub => ({ date: new Date(sub.nextBillingDate), amount: sub.price }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const nextPayment = upcomingPayments.length > 0 ? upcomingPayments[0] : null;
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your subscriptions and billing details.
          </p>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Subscriptions
              </CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Spent
              </CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Next Payment
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {nextPayment ? (
                <div className="text-2xl font-bold">
                  {formatCurrency(nextPayment.amount)}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    on {nextPayment.date.toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className="text-gray-500">No upcoming payments</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Subscriptions section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Subscriptions</h2>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
          
          {userSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No active subscriptions</h3>
                <p className="text-gray-500 text-center mb-4">
                  You don't have any active subscriptions yet. Explore our products to get started.
                </p>
                <Button onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
