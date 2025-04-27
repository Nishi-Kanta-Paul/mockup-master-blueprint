
import { MainLayout } from "@/components/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAuthState } from "@/lib/auth";
import { invoices, subscriptions } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export function Billing() {
  const { user } = getAuthState();
  
  // Filter subscriptions for current user
  const userSubscriptions = subscriptions.filter(sub => sub.userId === user?.id);
  
  // Filter invoices for current user's subscriptions
  const userSubscriptionIds = userSubscriptions.map(sub => sub.id);
  const userInvoices = invoices.filter(inv => 
    userSubscriptionIds.includes(inv.subscriptionId)
  ).sort((a, b) => new Date(b.billingDate).getTime() - new Date(a.billingDate).getTime());

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing History</h1>
          <p className="text-gray-600">
            View and download your invoices.
          </p>
        </div>
        
        {userInvoices.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.productName}</TableCell>
                    <TableCell>{formatDate(invoice.billingDate)}</TableCell>
                    <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "paid" ? "default" : 
                                     invoice.status === "pending" ? "outline" : "destructive"}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No billing history</h3>
            <p className="text-gray-500">
              You don't have any invoices yet. They will appear here once you subscribe to a product.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Billing;
