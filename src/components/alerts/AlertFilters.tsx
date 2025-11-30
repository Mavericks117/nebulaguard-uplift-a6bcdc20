import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { AlertSeverity } from "./SeverityBadge";

interface AlertFiltersProps {
  selectedSeverities: AlertSeverity[];
  onSeverityChange: (severities: AlertSeverity[]) => void;
  showAcknowledged: boolean;
  onShowAcknowledgedChange: (show: boolean) => void;
}

const AlertFilters = ({
  selectedSeverities,
  onSeverityChange,
  showAcknowledged,
  onShowAcknowledgedChange,
}: AlertFiltersProps) => {
  const severities: AlertSeverity[] = ["critical", "high", "warning", "info"];

  const toggleSeverity = (severity: AlertSeverity) => {
    if (selectedSeverities.includes(severity)) {
      onSeverityChange(selectedSeverities.filter((s) => s !== severity));
    } else {
      onSeverityChange([...selectedSeverities, severity]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Severity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {severities.map((severity) => (
          <DropdownMenuCheckboxItem
            key={severity}
            checked={selectedSeverities.includes(severity)}
            onCheckedChange={() => toggleSeverity(severity)}
          >
            {severity.toUpperCase()}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showAcknowledged}
          onCheckedChange={onShowAcknowledgedChange}
        >
          Show Acknowledged
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlertFilters;
