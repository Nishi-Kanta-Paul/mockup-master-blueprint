
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractPrice } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface ContractPriceFormProps {
  contractId: string;
  products: Array<{ id: string; name: string }>;
  onSave: (price: Omit<ContractPrice, 'id'>) => void;
  onCancel: () => void;
  initialData?: ContractPrice;
}

export function ContractPriceForm({ 
  contractId, 
  products, 
  onSave, 
  onCancel,
  initialData 
}: ContractPriceFormProps) {
  const [productId, setProductId] = useState<string>(initialData?.productId || "");
  const [price, setPrice] = useState<string>(initialData?.price.toString() || "");
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(
    initialData?.effectiveDate ? new Date(initialData.effectiveDate) : new Date()
  );
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    initialData?.expirationDate ? new Date(initialData.expirationDate) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !price || !effectiveDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const priceData: Omit<ContractPrice, 'id'> = {
      contractId,
      productId,
      price: priceValue,
      effectiveDate: effectiveDate.toISOString(),
      expirationDate: expirationDate?.toISOString()
    };
    
    // Simulate API call delay
    setTimeout(() => {
      onSave(priceData);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select
          value={productId}
          onValueChange={setProductId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
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
          placeholder="0.00"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Effective Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !effectiveDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {effectiveDate ? format(effectiveDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={effectiveDate}
              onSelect={setEffectiveDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Expiration Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !expirationDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expirationDate ? format(expirationDate, "PPP") : <span>No expiration</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expirationDate}
              onSelect={setExpirationDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? "Update Price" : "Add Price"}
        </Button>
      </div>
    </form>
  );
}
