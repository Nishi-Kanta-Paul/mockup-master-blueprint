
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/data/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types";

export function AdminProducts() {
  const [productList, setProductList] = useState(products);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    regularPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDI3fHx0ZWNobm9sb2d5fGVufDB8fHx8MTY5OTU3Mjk3NXww&ixlib=rb-4.0.3&q=80&w=400"
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [name]: name === "regularPrice" ? parseFloat(value) || 0 : value
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: name === "regularPrice" ? parseFloat(value) || 0 : value
      });
    }
  };
  
  const handleAddProduct = () => {
    const newId = `prod_${productList.length + 1}`;
    const productToAdd = {
      ...newProduct,
      id: newId
    };
    
    setProductList([...productList, productToAdd]);
    setIsAddDialogOpen(false);
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully.`
    });
    
    // Reset form
    setNewProduct({
      name: "",
      shortDescription: "",
      description: "",
      category: "",
      regularPrice: 0,
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDI3fHx0ZWNobm9sb2d5fGVufDB8fHx8MTY5OTU3Mjk3NXww&ixlib=rb-4.0.3&q=80&w=400"
    });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    
    const updatedProducts = productList.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    );
    
    setProductList(updatedProducts);
    setIsEditDialogOpen(false);
    toast({
      title: "Product Updated",
      description: `${selectedProduct.name} has been updated successfully.`
    });
    
    setSelectedProduct(null);
  };
  
  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = productList.filter(product => product.id !== productId);
    
    setProductList(updatedProducts);
    toast({
      title: "Product Deleted",
      description: "The product has been deleted successfully."
    });
  };
  
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new product or subscription to offer to your customers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={newProduct.name} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input 
                    id="shortDescription" 
                    name="shortDescription"
                    value={newProduct.shortDescription} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newProduct.description} 
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      name="category"
                      value={newProduct.category} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regularPrice">Regular Price</Label>
                    <Input 
                      id="regularPrice" 
                      name="regularPrice"
                      type="number"
                      min="0"
                      step="0.01" 
                      value={newProduct.regularPrice} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product details below.
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name"
                    value={selectedProduct.name} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-shortDescription">Short Description</Label>
                  <Input 
                    id="edit-shortDescription" 
                    name="shortDescription"
                    value={selectedProduct.shortDescription} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Full Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description"
                    value={selectedProduct.description} 
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input 
                      id="edit-category" 
                      name="category"
                      value={selectedProduct.category} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-regularPrice">Regular Price</Label>
                    <Input 
                      id="edit-regularPrice" 
                      name="regularPrice"
                      type="number"
                      min="0"
                      step="0.01" 
                      value={selectedProduct.regularPrice} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.regularPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
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

export default AdminProducts;
