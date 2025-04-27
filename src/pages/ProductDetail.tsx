
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products, contractPrices, contracts } from "@/data/mockData";
import { getAuthState } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = getAuthState();
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Check for corporate pricing
  let contractPrice: number | undefined;
  
  if (user?.role === "corporate") {
    // Find active contracts for this corporate user
    const activeContracts = contracts.filter(contract => 
      contract.corporateName === "Acme Corporation" && // This would normally be matched to the user's company
      contract.status === "active"
    );
    
    // Get contract price for this product
    if (activeContracts.length > 0) {
      const contractId = activeContracts[0].id;
      const price = contractPrices.find(p => p.contractId === contractId && p.productId === product.id);
      
      if (price) {
        contractPrice = price.price;
      }
    }
  }
  
  const displayPrice = contractPrice !== undefined ? contractPrice : product.regularPrice;
  const hasDiscount = contractPrice !== undefined && contractPrice < product.regularPrice;
  
  const handleSubscribe = () => {
    toast({
      title: "Subscription Started",
      description: `You've successfully subscribed to ${product.name}`,
    });
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/products")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.shortDescription}</p>
            </div>
            
            <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>Full lifetime access to course materials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>Regular content updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="mb-6">
                <p className="text-gray-500 mb-1">Price</p>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{formatCurrency(displayPrice)}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                {hasDiscount && (
                  <div className="mt-2">
                    <span className="line-through text-gray-400 mr-2">
                      {formatCurrency(product.regularPrice)}/month
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Corporate Discount
                    </span>
                  </div>
                )}
              </div>
              
              <Button className="w-full mb-4" onClick={handleSubscribe}>
                Subscribe Now
              </Button>
              
              <div className="text-sm text-gray-500">
                <p className="mb-2">Your subscription includes:</p>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Cancel anytime</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Instant access to all content</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductDetail;
