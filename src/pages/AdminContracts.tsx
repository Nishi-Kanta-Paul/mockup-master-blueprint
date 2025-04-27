
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { contracts, contractPrices, products } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { Plus, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AdminContracts() {
  // Get products map for displaying names
  const productsMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {} as Record<string, typeof products[0]>);

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
        
        <Card>
          <CardHeader>
            <CardTitle>Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {contracts.map((contract) => {
                // Get prices for this contract
                const prices = contractPrices.filter(price => price.contractId === contract.id);
                
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
                          <Button size="sm">
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
