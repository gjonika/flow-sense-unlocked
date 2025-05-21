
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReadingEntry, useRecentReadings } from "@/hooks/useRecentReadings";

interface RecentReadingsTableProps {
  limit?: number;
  showRefreshButton?: boolean;
  className?: string;
}

export function RecentReadingsTable({
  limit = 5,
  showRefreshButton = false,
  className = ""
}: RecentReadingsTableProps) {
  const { readings, loading, error, refetch } = useRecentReadings({ limit });

  // Loading state
  if (loading) {
    return (
      <div className={`border rounded-md ${className}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3).fill(0).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="px-4 py-2 bg-muted/20">
          <Progress value={60} className="h-1" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border rounded-md p-4 text-center">
        <p className="text-sm text-destructive mb-2">Failed to load readings</p>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          size="sm"
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Try again
        </Button>
      </div>
    );
  }

  // Empty state
  if (readings.length === 0) {
    return (
      <div className={`border rounded-md ${className}`}>
        <p className="text-sm text-muted-foreground p-4 text-center">No recent readings found.</p>
        {showRefreshButton && (
          <div className="flex justify-center pb-4">
            <Button
              variant="outline"
              onClick={() => refetch()}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Render data
  return (
    <div className={`border rounded-md ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reading</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.map((reading) => (
            <TableRow key={reading.id}>
              <TableCell>{formatDate(new Date(reading.readingdate))}</TableCell>
              <TableCell className="capitalize">{reading.utilitytype}</TableCell>
              <TableCell>{reading.reading !== null ? `${reading.reading} ${reading.unit || ''}` : '-'}</TableCell>
              <TableCell>${reading.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showRefreshButton && (
        <div className="flex justify-end p-2 border-t">
          <Button
            variant="ghost"
            onClick={() => refetch()}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
