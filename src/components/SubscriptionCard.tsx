
import { Subscription } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="h-2 bg-primary w-full"></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{subscription.product.name}</span>
          <span className="flex items-center text-sm font-normal text-green-600">
            <BadgeCheck className="h-4 w-4 mr-1" />
            Active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <p className="text-sm text-gray-600">{subscription.product.shortDescription}</p>
          
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
            Next billing: {formatDate(subscription.nextBillingDate)}
          </div>
          
          <div className="font-medium">
            ${subscription.price.toFixed(2)}/month
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button variant="destructive" size="sm">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
