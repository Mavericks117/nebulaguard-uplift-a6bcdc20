import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, AlertCircle, Info } from "lucide-react";

export type AlertSeverity = "critical" | "high" | "warning" | "info";

interface SeverityBadgeProps {
  severity: AlertSeverity;
  className?: string;
}

const SeverityBadge = ({ severity, className = "" }: SeverityBadgeProps) => {
  const config = {
    critical: {
      label: "CRITICAL",
      bg: "bg-destructive/20",
      text: "text-destructive",
      border: "border-destructive/30",
      icon: X,
    },
    high: {
      label: "HIGH",
      bg: "bg-accent/20",
      text: "text-accent",
      border: "border-accent/30",
      icon: AlertTriangle,
    },
    warning: {
      label: "WARNING",
      bg: "bg-warning/20",
      text: "text-warning",
      border: "border-warning/30",
      icon: AlertCircle,
    },
    info: {
      label: "INFO",
      bg: "bg-primary/20",
      text: "text-primary",
      border: "border-primary/30",
      icon: Info,
    },
  };

  const { label, bg, text, border, icon: Icon } = config[severity];

  return (
    <Badge
      variant="outline"
      className={`${bg} ${text} ${border} gap-1.5 ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};

export default SeverityBadge;
