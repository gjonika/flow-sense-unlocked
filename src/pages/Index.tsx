
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface Supplier {
  id: string;
  name: string;
  utility_type: string;
  input_type: string;
  login_url: string | null;
  category_id: string | null;
  is_meter_based: boolean;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories_utilities")
          .select("*");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch suppliers
        const { data: suppliersData, error: suppliersError } = await supabase
          .from("suppliers_utilities")
          .select("*");

        if (suppliersError) throw suppliersError;
        setSuppliers(suppliersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return "#64748b"; // Default gray
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : "#64748b";
  };

  return (
    <div className="container mx-auto p-4 space-y-6 bg-[#fdfcf7] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#808355]">UtilityTracker</h1>
          <p className="text-muted-foreground">
            Track and manage your utility readings and payments
          </p>
        </div>
        <Button 
          onClick={() => navigate("/add-reading")} 
          className="bg-[#d1b37f] hover:bg-[#c4a66e] flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Reading
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading utilities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden border border-[#d1b37f]/30">
              <div 
                className="h-2" 
                style={{ backgroundColor: getCategoryColor(supplier.category_id) }}
              ></div>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{supplier.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {supplier.utility_type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-muted-foreground">
                    {supplier.is_meter_based ? "Meter + Cost" : "Cost Only"}
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/suppliers/${supplier.id}`)}
                    className="border-[#d1b37f] text-[#808355]"
                  >
                    View Details
                  </Button>
                </div>
                {supplier.login_url && (
                  <div className="mt-4">
                    <a 
                      href={supplier.login_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Portal Login →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
