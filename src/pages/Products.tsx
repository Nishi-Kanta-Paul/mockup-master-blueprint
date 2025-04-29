
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { ProductCard } from "@/components/ProductCard";
import { products, contractPrices, contracts } from "@/data/mockData";
import { getAuthState } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider"; 
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]); // Min and max price
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const { user } = getAuthState();
  const isCorporate = user?.role === "corporate";
  
  // Get all unique categories from products
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];
  
  // Get subcategories based on selected category
  const subcategories = categoryFilter === "all" 
    ? ["all"] 
    : ["all", ...Array.from(new Set(
        products
          .filter(product => categoryFilter === "all" || product.category === categoryFilter)
          .map(product => product.shortDescription) // Using shortDescription as subcategory for demo
      ))];
  
  // Get min and max price
  const minPrice = Math.min(...products.map(product => product.regularPrice));
  const maxPrice = Math.max(...products.map(product => product.regularPrice));
  
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
  
  // Filter products when any filter changes
  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      const matchesSubcategory = subcategoryFilter === "all" || product.shortDescription === subcategoryFilter;
      
      const matchesPrice = product.regularPrice >= priceRange[0] && product.regularPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, subcategoryFilter, priceRange]);
  
  // Initialize with all products
  useEffect(() => {
    setFilteredProducts(products);
  }, []);

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
          
          <Button 
            variant="outline" 
            className="sm:w-auto" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md bg-gray-50">
            <div>
              <Label htmlFor="category" className="mb-2 block">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
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
            
            <div>
              <Label htmlFor="subcategory" className="mb-2 block">Subcategory</Label>
              <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map(subcategory => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory === "all" ? "All Subcategories" : subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
          </div>
        )}
        
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
