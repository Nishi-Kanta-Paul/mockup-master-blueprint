
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { subscriptions, users } from "@/data/mockData";
import { capitalize, formatDate } from "@/lib/utils";
import { Search, UserPlus, Eye } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Subscription } from "@/types";

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get subscription counts for each user
  const userSubscriptionCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.userId] = (acc[sub.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get user subscriptions
  const getUserSubscriptions = (userId: string): Subscription[] => {
    return subscriptions.filter(sub => sub.userId === userId);
  };

  // Open user details dialog
  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminLayout activeTab="users">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* User Subscriptions Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                {selectedUser?.name}'s account and subscription information
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Full Name</h3>
                    <p>{selectedUser.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Email</h3>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Role</h3>
                    <Badge variant={selectedUser.role === "admin" ? "destructive" : selectedUser.role === "corporate" ? "outline" : "default"}>
                      {capitalize(selectedUser.role)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Verification Status</h3>
                    <Badge variant={selectedUser.verified ? "default" : "outline"}>
                      {selectedUser.verified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Active Subscriptions</h3>
                  {getUserSubscriptions(selectedUser.id).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Next Billing</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getUserSubscriptions(selectedUser.id).map(subscription => (
                          <TableRow key={subscription.id}>
                            <TableCell>{subscription.product.name}</TableCell>
                            <TableCell>{formatDate(subscription.startDate)}</TableCell>
                            <TableCell>{formatDate(subscription.nextBillingDate)}</TableCell>
                            <TableCell className="text-right">${subscription.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                                {capitalize(subscription.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded border">
                      No active subscriptions found for this user
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscriptions</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : user.role === "corporate" ? "outline" : "default"}>
                        {capitalize(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>{userSubscriptionCounts[user.id] || 0}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openUserDetails(user)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
