
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { contracts, contractPrices, products } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { Plus, ChevronDown, Calendar } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ContractPrice } from "@/types";

export function AdminContracts() {
  const [contractsList, setContractsList] = useState(contracts);
  const [pricesList, setPricesList] = useState(contractPrices);
  const [isAddPriceDialogOpen, setIsAddPriceDialogOpen] = useState(false);
  const [currentContractId, setCurrentContractId] = useState<string | null>(null);
  const [newContractPrice, setNewContractPrice] = useState<Partial<ContractPrice>>({
    price: 0,
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  // Get products map for displaying names
  const productsMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {} as Record<string, typeof products[0]>);

  // Handle adding a new price
  const handleAddPrice = () => {
    if (!currentContractId || !newContractPrice.productId) {
      toast({
        title: "Missing information",
        description: "Please select a product and fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newPrice = {
      id: `price_${pricesList.length + 1}`,
      contractId: currentContractId,
      productId: newContractPrice.productId,
      price: newContractPrice.price || 0,
      effectiveDate: newContractPrice.effectiveDate || new Date().toISOString().split('T')[0],
    };

    setPricesList([...pricesList, newPrice]);
    setIsAddPriceDialogOpen(false);
    
    toast({
      title: "Price Added",
      description: `New contract price has been added successfully.`
    });

    // Reset form
    setNewContractPrice({
      price: 0,
      effectiveDate: new Date().toISOString().split('T')[0]
    });
  };

  const openAddPriceDialog = (contractId: string) => {
    setCurrentContractId(contractId);
    setIsAddPriceDialogOpen(true);
  };

  return (
    <AdminLayout activeTab="contracts">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Contract & Price Management</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contract
          </Button>
        </div>
        
        {/* Add Contract Price Dialog */}
        <Dialog open={isAddPriceDialogOpen} onOpenChange={setIsAddPriceDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Contract Price</DialogTitle>
              <DialogDescription>
                Add a special pricing for a product under this contract.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Select
                  onValueChange={(value) => setNewContractPrice({...newContractPrice, productId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Contract Price</Label>
                <Input 
                  id="price" 
                  type="number"
                  min="0"
                  step="0.01" 
                  value={newContractPrice.price || 0} 
                  onChange={(e) => setNewContractPrice({...newContractPrice, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <div className="relative">
                  <Input 
                    id="effectiveDate" 
                    type="date"
                    value={newContractPrice.effectiveDate} 
                    onChange={(e) => setNewContractPrice({...newContractPrice, effectiveDate: e.target.value})}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPriceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPrice}>
                Add Price
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {contractsList.map((contract) => {
                // Get prices for this contract
                const prices = pricesList.filter(price => price.contractId === contract.id);
                
                return (
                  <AccordionItem value={contract.id} key={contract.id}>
                    <AccordionTrigger className="hover:bg-gray-50 px-4">
                      <div className="flex flex-1 items-center justify-between pr-4">
                        <div>
                          <span className="font-medium">{contract.corporateName}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Valid until: {formatDate(contract.expirationDate)}
                          </span>
                          <Badge variant={contract.status === "active" ? "default" : "destructive"}>
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Contract Prices</h4>
                          <Button size="sm" onClick={() => openAddPriceDialog(contract.id)}>
                            <Plus className="mr-2 h-3 w-3" />
                            Add Price
                          </Button>
                        </div>
                        
                        {prices.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Regular Price</TableHead>
                                <TableHead className="text-right">Contract Price</TableHead>
                                <TableHead>Effective Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {prices.map((price) => {
                                const product = productsMap[price.productId];
                                return (
                                  <TableRow key={price.id}>
                                    <TableCell>{product?.name || "Unknown Product"}</TableCell>
                                    <TableCell className="text-right">${product?.regularPrice.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${price.price.toFixed(2)}</TableCell>
                                    <TableCell>{formatDate(price.effectiveDate)}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No special pricing for this contract
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminContracts;
