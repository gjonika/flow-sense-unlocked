
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Filter, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface HistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterSupplier: string;
  setFilterSupplier: (value: string) => void;
  filterDateFrom: Date | undefined;
  setFilterDateFrom: (date: Date | undefined) => void;
  filterDateTo: Date | undefined;
  setFilterDateTo: (date: Date | undefined) => void;
  filterPriceRange: { min: string; max: string };
  setFilterPriceRange: (value: { min: string; max: string }) => void;
  activeFilters: string[];
  removeFilter: (filter: string) => void;
  clearAllFilters: () => void;
  types: Set<string>;
  suppliers: Set<string>;
}

export const HistoryFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterSupplier,
  setFilterSupplier,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  filterPriceRange,
  setFilterPriceRange,
  activeFilters,
  removeFilter,
  clearAllFilters,
  types,
  suppliers,
}: HistoryFiltersProps) => {
  const [filtersPopoverOpen, setFiltersPopoverOpen] = useState(false);

  // Helper function for updating the price range
  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const updatedRange = { ...filterPriceRange, [field]: value };
    setFilterPriceRange(updatedRange);
  };

  return (
    <>
      {/* Basic Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search readings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Array.from(types).sort().map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Advanced Filters */}
        <Popover open={filtersPopoverOpen} onOpenChange={setFiltersPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>
              
              {/* Supplier filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {Array.from(suppliers).sort().map(supplier => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDateFrom ? format(filterDateFrom, 'PPP') : 'From date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDateFrom}
                        onSelect={setFilterDateFrom}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDateTo ? format(filterDateTo, 'PPP') : 'To date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDateTo}
                        onSelect={setFilterDateTo}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Price range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filterPriceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  />
                  <span>-</span>
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filterPriceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setFiltersPopoverOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={clearAllFilters}
            size="sm"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="px-2 py-1"
            >
              {filter}
              <button 
                className="ml-1 hover:text-destructive" 
                onClick={() => removeFilter(filter)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </>
  );
};
