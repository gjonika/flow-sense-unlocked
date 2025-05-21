
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
  readingdate: Date | string;
  utilitytype: string;
  supplier: string;
  reading?: string | number;
  unit?: string;
  amount: number;
  notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
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
                  <TableCell>{formatDate(new Date(reading.readingdate))}</TableCell>
                  <TableCell className="capitalize">{reading.utilitytype}</TableCell>
                  <TableCell>{reading.supplier}</TableCell>
                  <TableCell>{reading.reading || '-'}</TableCell>
                  <TableCell>{reading.unit || '-'}</TableCell>
                  <TableCell>${reading.amount.toFixed(2)}</TableCell>
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
