
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ExternalLink, Minus } from "lucide-react";
import { Button } from "./ui/button";

interface UtilityCardProps {
  title: string;
  value: string;
  change: string;
  type: "increase" | "decrease" | "neutral";
  color: string;
  supplier?: string;
  amount?: string;
  supplierId?: string;
  websiteUrl?: string;
}

export function UtilityCard({ 
  title, 
  value, 
  change, 
  type, 
  color, 
  supplier, 
  amount, 
  supplierId,
  websiteUrl 
}: UtilityCardProps) {
  
  const handleVisitWebsite = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 bg-${color}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {supplier && (
          <div className="text-sm text-muted-foreground mt-1 flex items-center justify-between">
            <span>{supplier}</span>
            {websiteUrl && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 p-0 ml-2"
                onClick={() => handleVisitWebsite(websiteUrl)}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
        {amount && (
          <div className="text-sm font-medium mt-1">
            {amount}
          </div>
        )}
        {supplierId && (
          <div className="text-xs text-muted-foreground mt-0.5">
            ID: {supplierId}
          </div>
        )}
        <div className="flex items-center mt-1">
          <span 
            className={cn(
              "text-xs font-medium flex items-center",
              type === "increase" && "text-red-500",
              type === "decrease" && "text-green-500",
              type === "neutral" && "text-gray-500"
            )}
          >
            {type === "increase" && <ArrowUp className="h-3 w-3 mr-1" />}
            {type === "decrease" && <ArrowDown className="h-3 w-3 mr-1" />}
            {type === "neutral" && <Minus className="h-3 w-3 mr-1" />}
            {change}
          </span>
          <p className="text-xs text-muted-foreground ml-1">from last month</p>
        </div>
      </CardContent>
    </Card>
  );
}
