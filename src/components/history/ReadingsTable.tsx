
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Reading {
  id: string;
  date: string;
  supplier_id: string;
  supplier_name?: string;
  utility_type?: string;
  reading_value?: number | null;
  unit?: string | null;
  cost: number;
  notes?: string | null;
  created_at: string;
}

interface ReadingsTableProps {
  isLoading: boolean;
  filteredReadings: Reading[];
  readings: Reading[];
}

export const ReadingsTable = ({ 
  isLoading, 
  filteredReadings, 
  readings 
}: ReadingsTableProps) => {
  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading readings...
                </TableCell>
              </TableRow>
            ) : filteredReadings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No readings match the current filters
                </TableCell>
              </TableRow>
            ) : (
              filteredReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{formatDate(new Date(reading.date))}</TableCell>
                  <TableCell className="capitalize">{reading.utility_type}</TableCell>
                  <TableCell>{reading.supplier_name}</TableCell>
                  <TableCell>{reading.reading_value || '-'}</TableCell>
                  <TableCell>{reading.unit || '-'}</TableCell>
                  <TableCell>${reading.cost.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {reading.notes || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-right text-sm text-muted-foreground">
        Showing {filteredReadings.length} of {readings.length} readings
      </div>
    </>
  );
};
