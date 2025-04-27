
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  contractPrice?: number;
}

export function ProductCard({ product, contractPrice }: ProductCardProps) {
  const navigate = useNavigate();
  const displayPrice = contractPrice !== undefined ? contractPrice : product.regularPrice;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{product.shortDescription}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">
            ${displayPrice.toFixed(2)}
            {contractPrice !== undefined && contractPrice < product.regularPrice && (
              <span className="ml-2 text-xs line-through text-gray-500">
                ${product.regularPrice.toFixed(2)}
              </span>
            )}
          </span>
          {contractPrice !== undefined && contractPrice < product.regularPrice && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Corporate Discount
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(`/products/${product.id}`)}
          className="w-full"
          variant="outline"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
