
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Cloud, CloudOff, AlertCircle, Loader2 } from "lucide-react";
import { Survey } from "@/types/survey";

interface SyncStatusBadgeProps {
  survey: Survey;
  isOnline: boolean;
  className?: string;
}

const SyncStatusBadge = ({ survey, isOnline, className }: SyncStatusBadgeProps) => {
  // Determine sync status
  const getSyncStatus = () => {
    if (survey.id.startsWith('temp_')) {
      return 'pending';
    }
    if (survey.needs_sync) {
      return 'pending';
    }
    if (survey.last_synced_at) {
      return 'synced';
    }
    return 'unknown';
  };

  const syncStatus = getSyncStatus();

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'pending':
        return {
          icon: isOnline ? Loader2 : CloudOff,
          text: isOnline ? 'Syncing...' : 'Offline',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        };
      case 'synced':
        return {
          icon: Cloud,
          text: 'Synced',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-300',
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Unknown',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-300',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className} flex items-center gap-1 text-xs`}
    >
      <Icon className={`h-3 w-3 ${syncStatus === 'pending' && isOnline ? 'animate-spin' : ''}`} />
      {config.text}
    </Badge>
  );
};

export default SyncStatusBadge;
