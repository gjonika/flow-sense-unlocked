
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import { ReadingsTable } from "@/components/history/ReadingsTable";
import { HistoryDialogs } from "@/components/history/HistoryDialogs";
import { format } from "date-fns";

type Reading = {
  id: string;
  readingdate: Date | string;
  utilitytype: string;
  supplier: string;
  reading?: string | number;
  unit?: string;
  amount: number;
  notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>(undefined);
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>(undefined);
  const [filterPriceRange, setFilterPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [readings, setReadings] = useState<Reading[]>([]);
  const [suppliers, setSuppliers] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch readings from Supabase
  const fetchReadings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('*')
        .order('readingdate', { ascending: false });
      
      if (error) throw error;
      
      setReadings(data || []);
      
      // Extract unique suppliers and types
      const uniqueSuppliers = new Set<string>();
      const uniqueTypes = new Set<string>();
      
      data?.forEach(entry => {
        uniqueSuppliers.add(entry.supplier);
        uniqueTypes.add(entry.utilitytype);
      });
      
      setSuppliers(uniqueSuppliers);
      setTypes(uniqueTypes);
    } catch (error) {
      console.error('Error fetching readings:', error);
      toast({
        title: "Error",
        description: "Failed to load utility readings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  // Update active filters when filter values change
  useEffect(() => {
    const newActiveFilters: string[] = [];
    
    if (filterType !== "all") newActiveFilters.push(`Type: ${filterType}`);
    if (filterSupplier !== "all") newActiveFilters.push(`Supplier: ${filterSupplier}`);
    if (filterDateFrom) newActiveFilters.push(`From: ${format(filterDateFrom, 'MMM d, yyyy')}`);
    if (filterDateTo) newActiveFilters.push(`To: ${format(filterDateTo, 'MMM d, yyyy')}`);
    if (filterPriceRange.min) newActiveFilters.push(`Min: $${filterPriceRange.min}`);
    if (filterPriceRange.max) newActiveFilters.push(`Max: $${filterPriceRange.max}`);
    
    setActiveFilters(newActiveFilters);
  }, [filterType, filterSupplier, filterDateFrom, filterDateTo, filterPriceRange]);

  // Filter readings based on all filters
  const filteredReadings = readings.filter((reading) => {
    // Search term filter
    const matchesSearch = 
      (reading.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      reading.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.utilitytype.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Utility type filter
    const matchesType = filterType === "all" || reading.utilitytype.toLowerCase() === filterType.toLowerCase();
    
    // Supplier filter
    const matchesSupplier = filterSupplier === "all" || reading.supplier === filterSupplier;
    
    // Date range filter
    let matchesDateRange = true;
    const readingDate = new Date(reading.readingdate);
    if (filterDateFrom) matchesDateRange = matchesDateRange && readingDate >= filterDateFrom;
    if (filterDateTo) matchesDateRange = matchesDateRange && readingDate <= filterDateTo;
    
    // Price range filter
    let matchesPriceRange = true;
    if (filterPriceRange.min) matchesPriceRange = matchesPriceRange && reading.amount >= parseFloat(filterPriceRange.min);
    if (filterPriceRange.max) matchesPriceRange = matchesPriceRange && reading.amount <= parseFloat(filterPriceRange.max);
    
    return matchesSearch && matchesType && matchesSupplier && matchesDateRange && matchesPriceRange;
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterSupplier("all");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setFilterPriceRange({ min: "", max: "" });
  };

  // Handle successful import
  const handleImportSuccess = () => {
    setImportDialogOpen(false);
    fetchReadings();
    toast({
      title: "Success",
      description: "Entries imported successfully",
    });
  };

  // Handle delete all entries
  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase
        .from('utility_entries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all entries
      
      if (error) throw error;
      
      setDeleteConfirmOpen(false);
      fetchReadings();
      toast({
        title: "Success",
        description: "All entries have been deleted",
      });
    } catch (error) {
      console.error('Error deleting entries:', error);
      toast({
        title: "Error",
        description: "Failed to delete entries",
        variant: "destructive",
      });
    }
  };

  // Remove a single filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("Type:")) setFilterType("all");
    else if (filter.startsWith("Supplier:")) setFilterSupplier("all");
    else if (filter.startsWith("From:")) setFilterDateFrom(undefined);
    else if (filter.startsWith("To:")) setFilterDateTo(undefined);
    else if (filter.startsWith("Min:")) setFilterPriceRange(prev => ({ ...prev, min: "" }));
    else if (filter.startsWith("Max:")) setFilterPriceRange(prev => ({ ...prev, max: "" }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <HistoryHeader 
        setDeleteConfirmOpen={setDeleteConfirmOpen} 
        setImportDialogOpen={setImportDialogOpen}
      />

      <HistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterSupplier={filterSupplier}
        setFilterSupplier={setFilterSupplier}
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
        filterPriceRange={filterPriceRange}
        setFilterPriceRange={setFilterPriceRange}
        activeFilters={activeFilters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        types={types}
        suppliers={suppliers}
      />

      <ReadingsTable 
        isLoading={isLoading}
        filteredReadings={filteredReadings}
        readings={readings}
      />

      <HistoryDialogs
        importDialogOpen={importDialogOpen}
        setImportDialogOpen={setImportDialogOpen}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        handleDeleteAll={handleDeleteAll}
        handleImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default History;
