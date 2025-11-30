import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import SeverityBadge, { AlertSeverity } from "./SeverityBadge";
import AlertActionMenu from "./AlertActionMenu";
import AlertDetailDrawer from "./AlertDetailDrawer";
import TableSkeleton from "@/components/loading/TableSkeleton";

interface Alert {
  id: number;
  severity: AlertSeverity;
  host: string;
  category: string;
  problem: string;
  duration: string;
  acknowledged: boolean;
  timestamp: string;
}

// Mock data
const mockAlerts: Alert[] = [
  {
    id: 1,
    severity: "critical",
    host: "api-gateway-01",
    category: "Disk",
    problem: "Disk space critical - 95% full",
    duration: "5m",
    acknowledged: false,
    timestamp: "2025-11-30 14:23:00",
  },
  {
    id: 2,
    severity: "high",
    host: "prod-web-01",
    category: "CPU",
    problem: "High CPU usage detected - 92%",
    duration: "12m",
    acknowledged: false,
    timestamp: "2025-11-30 14:16:00",
  },
  {
    id: 3,
    severity: "high",
    host: "db-master-01",
    category: "Performance",
    problem: "Slow query performance detected",
    duration: "18m",
    acknowledged: true,
    timestamp: "2025-11-30 14:10:00",
  },
  {
    id: 4,
    severity: "warning",
    host: "cache-redis-03",
    category: "Memory",
    problem: "Memory pressure warning - 78%",
    duration: "25m",
    acknowledged: false,
    timestamp: "2025-11-30 14:03:00",
  },
  {
    id: 5,
    severity: "warning",
    host: "worker-queue-02",
    category: "Queue",
    problem: "Queue processing delay detected",
    duration: "32m",
    acknowledged: true,
    timestamp: "2025-11-30 13:56:00",
  },
];

interface AlertsTableProps {
  alerts?: Alert[];
  loading?: boolean;
}

const AlertsTable = ({ alerts = mockAlerts, loading = false }: AlertsTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(alerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = alerts.slice(startIndex, endIndex);

  const handleRowClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={7} />;
  }

  if (alerts.length === 0) {
    return (
      <div className="cyber-card flex flex-col items-center justify-center py-16">
        <Search className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Alerts Found</h3>
        <p className="text-muted-foreground mb-4">
          No alerts match your current filter criteria
        </p>
        <Button variant="outline">Clear Filters</Button>
      </div>
    );
  }

  return (
    <>
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAlerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(alert)}
                >
                  <TableCell>
                    <SeverityBadge severity={alert.severity} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.host}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{alert.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.problem}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {alert.duration}
                    </span>
                  </TableCell>
                  <TableCell>
                    {alert.acknowledged ? (
                      <span className="flex items-center gap-1 text-xs text-success">
                        <CheckCircle className="w-3 h-3" />
                        Acknowledged
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <AlertActionMenu
                      alertId={alert.id}
                      acknowledged={alert.acknowledged}
                      onViewDetails={() => handleRowClick(alert)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, alerts.length)} of{" "}
              {alerts.length} alerts
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        alert={selectedAlert}
      />
    </>
  );
};

export default AlertsTable;
