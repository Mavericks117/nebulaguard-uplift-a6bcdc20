import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UserLayout from "@/layouts/UserLayout";
import AlertsTable from "@/components/alerts/AlertsTable";
import AlertFilters from "@/components/alerts/AlertFilters";
import { AlertSeverity } from "@/components/alerts/SeverityBadge";

const UserAlerts = () => {
  const [selectedSeverities, setSelectedSeverities] = useState<AlertSeverity[]>([
    "critical",
    "high",
    "warning",
    "info",
  ]);
  const [showAcknowledged, setShowAcknowledged] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Alerts</h1>
            <p className="text-muted-foreground">Monitor and manage active alerts</p>
          </div>
          <Button className="bg-gradient-to-r from-success to-primary hover:opacity-90 text-background">
            Acknowledge All
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AlertFilters
            selectedSeverities={selectedSeverities}
            onSeverityChange={setSelectedSeverities}
            showAcknowledged={showAcknowledged}
            onShowAcknowledgedChange={setShowAcknowledged}
          />
        </div>

        {/* Alerts Table */}
        <AlertsTable />
      </div>
    </UserLayout>
  );
};

export default UserAlerts;
