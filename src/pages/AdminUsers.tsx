
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { subscriptions, users } from "@/data/mockData";
import { capitalize, formatDate } from "@/lib/utils";
import { Search, UserPlus, Eye, Filter, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Subscription } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isManageSubDialogOpen, setIsManageSubDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  
  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    // Sort users based on selected sort field and direction
    if (sortBy === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "email") {
      return sortDirection === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortBy === "role") {
      return sortDirection === "asc"
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    } else if (sortBy === "subscriptions") {
      const aCount = subscriptions.filter(sub => sub.userId === a.id).length;
      const bCount = subscriptions.filter(sub => sub.userId === b.id).length;
      return sortDirection === "asc" ? aCount - bCount : bCount - aCount;
    }
    return 0;
  });
  
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
    setUserSubscriptions(getUserSubscriptions(user.id));
    setIsViewDialogOpen(true);
  };
  
  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };
  
  // Manage user subscriptions
  const openManageSubscriptions = (user: User) => {
    setSelectedUser(user);
    setUserSubscriptions(getUserSubscriptions(user.id));
    setIsManageSubDialogOpen(true);
  };
  
  // Update subscription status
  const updateSubscriptionStatus = (subscriptionId: string, newStatus: "active" | "canceled" | "expired") => {
    // In a real app, this would update the database
    const updatedSubscriptions = userSubscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return { ...sub, status: newStatus };
      }
      return sub;
    });
    
    setUserSubscriptions(updatedSubscriptions);
    
    toast({
      title: "Subscription Updated",
      description: `Subscription status changed to ${capitalize(newStatus)}`,
    });
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
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-64">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Active Subscriptions</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        openManageSubscriptions(selectedUser);
                      }}
                    >
                      Manage Subscriptions
                    </Button>
                  </div>
                  
                  {userSubscriptions.length > 0 ? (
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
                        {userSubscriptions.map(subscription => (
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
        
        {/* Manage Subscriptions Dialog */}
        <Dialog open={isManageSubDialogOpen} onOpenChange={setIsManageSubDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Manage User Subscriptions</DialogTitle>
              <DialogDescription>
                Update subscription status for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                {userSubscriptions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Next Billing</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userSubscriptions.map(subscription => (
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
                          <TableCell>
                            <div className="flex gap-2">
                              {subscription.status !== "active" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => updateSubscriptionStatus(subscription.id, "active")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Activate
                                </Button>
                              )}
                              {subscription.status !== "canceled" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => updateSubscriptionStatus(subscription.id, "canceled")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded border">
                    No subscriptions found for this user
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsManageSubDialogOpen(false);
                  openUserDetails(selectedUser!);
                }}
              >
                Back to User Details
              </Button>
              <Button onClick={() => setIsManageSubDialogOpen(false)}>Done</Button>
            </DialogFooter>
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
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                    <div className="flex items-center">
                      Name
                      {sortBy === "name" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("email")}>
                    <div className="flex items-center">
                      Email
                      {sortBy === "email" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("role")}>
                    <div className="flex items-center">
                      Role
                      {sortBy === "role" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("subscriptions")}>
                    <div className="flex items-center">
                      Subscriptions
                      {sortBy === "subscriptions" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
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
                
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
