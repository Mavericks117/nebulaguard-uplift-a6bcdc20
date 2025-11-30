import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, MessageSquare } from "lucide-react";
import SeverityBadge, { AlertSeverity } from "./SeverityBadge";

interface AlertDetail {
  id: number;
  severity: AlertSeverity;
  host: string;
  category: string;
  problem: string;
  duration: string;
  acknowledged: boolean;
  timestamp: string;
}

interface AlertDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: AlertDetail | null;
}

const AlertDetailDrawer = ({
  open,
  onOpenChange,
  alert,
}: AlertDetailDrawerProps) => {
  if (!alert) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Alert Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SeverityBadge severity={alert.severity} />
              <Badge variant="outline">{alert.host}</Badge>
              <Badge variant="secondary">{alert.category}</Badge>
            </div>

            <h2 className="text-2xl font-bold">{alert.problem}</h2>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {alert.duration}
              </span>
              <span>{alert.timestamp}</span>
              {alert.acknowledged && (
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" />
                  Acknowledged
                </span>
              )}
            </div>
          </div>

          {/* Raw Metadata Placeholder */}
          <div className="cyber-card">
            <h3 className="text-lg font-semibold mb-3">Raw Metadata</h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Metadata details will be populated here...
              </p>
            </div>
          </div>

          {/* AI Insights Placeholder */}
          <div className="cyber-card border-primary/30">
            <h3 className="text-lg font-semibold mb-3">AI Insights</h3>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">
                AI-generated insights will appear here...
              </p>
            </div>
          </div>

          {/* Throttle/Dedupe Placeholder */}
          <div className="cyber-card">
            <h3 className="text-lg font-semibold mb-3">
              Throttle & Deduplication
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Throttle and deduplication info will be shown here...
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {!alert.acknowledged && (
              <Button className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Acknowledge
              </Button>
            )}
            <Button variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlertDetailDrawer;
