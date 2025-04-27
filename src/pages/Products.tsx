
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { ProductCard } from "@/components/ProductCard";
import { products, contractPrices, contracts } from "@/data/mockData";
import { getAuthState } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { user } = getAuthState();
  const isCorporate = user?.role === "corporate";
  
  // Get all unique categories from products
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];
  
  // Get contract prices for corporate users
  let corporateContractPrices: Record<string, number> = {};
  
  if (isCorporate) {
    // Find active contracts for this corporate user
    const activeContracts = contracts.filter(contract => 
      contract.corporateName === "Acme Corporation" && // This would normally be matched to the user's company
      contract.status === "active"
    );
    
    // Get contract prices for this contract
    if (activeContracts.length > 0) {
      const contractId = activeContracts[0].id;
      const prices = contractPrices.filter(price => price.contractId === contractId);
      
      corporateContractPrices = prices.reduce((acc, price) => {
        acc[price.productId] = price.price;
        return acc;
      }, {} as Record<string, number>);
    }
  }
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
          <p className="text-gray-600">
            Explore our range of courses and software subscriptions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-64">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                contractPrice={corporateContractPrices[product.id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Products;
