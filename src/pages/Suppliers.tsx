
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  utilitytype: string;
  unit: string | null;
  requires_reading: boolean | null;
  website_url?: string;
  custom_id?: string;
  additional_info?: string;
}

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  utilitytype: z.string().min(1, "Utility type is required"),
  unit: z.string().optional(),
  requires_reading: z.boolean().default(false),
  website_url: z.string().optional(),
  custom_id: z.string().optional(),
  additional_info: z.string().optional(),
});

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      utilitytype: "",
      unit: "",
      requires_reading: false,
      website_url: "",
      custom_id: "",
      additional_info: "",
    },
  });

  // Fetch suppliers from Supabase
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('utility_suppliers')
        .select('*');
      
      if (error) throw error;
      
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Open dialog for creating or editing a supplier
  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      form.reset({
        name: supplier.name,
        utilitytype: supplier.utilitytype,
        unit: supplier.unit || "",
        requires_reading: supplier.requires_reading || false,
        website_url: supplier.website_url || "",
        custom_id: supplier.custom_id || "",
        additional_info: supplier.additional_info || "",
      });
    } else {
      setEditingSupplier(null);
      form.reset({
        name: "",
        utilitytype: "",
        unit: "",
        requires_reading: false,
        website_url: "",
        custom_id: "",
        additional_info: "",
      });
    }
    setDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof supplierSchema>) => {
    try {
      const supplierData = {
        name: values.name,
        utilitytype: values.utilitytype,
        unit: values.unit || null,
        requires_reading: values.requires_reading,
        website_url: values.website_url || null,
        custom_id: values.custom_id || null,
        additional_info: values.additional_info || null,
      };

      if (editingSupplier) {
        // Update existing supplier
        const { error } = await supabase
          .from('utility_suppliers')
          .update(supplierData)
          .eq('id', editingSupplier.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        });
      } else {
        // Create new supplier
        const { error } = await supabase
          .from('utility_suppliers')
          .insert([supplierData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Supplier created successfully",
        });
      }

      setDialogOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast({
        title: "Error",
        description: "Failed to save supplier",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage utility suppliers and their properties
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Suppliers Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Requires Reading</TableHead>
              <TableHead>Custom ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading suppliers...
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No suppliers found
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell className="capitalize">{supplier.utilitytype}</TableCell>
                  <TableCell>{supplier.unit || '-'}</TableCell>
                  <TableCell>{supplier.requires_reading ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{supplier.custom_id || '-'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenDialog(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Supplier Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilitytype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="electricity, gas, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="kWh, m³, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="custom_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Account or customer ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requires_reading"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Requires Reading
                        </FormLabel>
                        <FormDescription>
                          Does this utility require meter readings?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="additional_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notes, account details, etc."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSupplier ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
