import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, MessageSquare, Eye, EyeOff, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import SeverityBadge, { AlertSeverity } from "./SeverityBadge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  if (!alert) return null;

  const handleRetryAI = () => {
    setAiLoading(true);
    setAiError(false);
    // Simulate AI loading
    setTimeout(() => {
      setAiLoading(false);
    }, 2000);
  };

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

          {/* Quick Action Links */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-3 h-3" />
              View in Zabbix
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-3 h-3" />
              View Raw Logs
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-3 h-3" />
              View in Wazuh
            </Button>
          </div>

          {/* Raw Metadata */}
          <div className="cyber-card">
            <h3 className="text-lg font-semibold mb-3">Raw Metadata</h3>
            <div className="p-4 bg-muted/50 rounded-lg font-mono text-xs">
              <div className="space-y-1">
                <p><span className="text-muted-foreground">Alert ID:</span> {alert.id}</p>
                <p><span className="text-muted-foreground">Host:</span> {alert.host}</p>
                <p><span className="text-muted-foreground">Category:</span> {alert.category}</p>
                <p><span className="text-muted-foreground">Severity:</span> {alert.severity.toUpperCase()}</p>
                <p><span className="text-muted-foreground">Timestamp:</span> {alert.timestamp}</p>
                <p><span className="text-muted-foreground">Duration:</span> {alert.duration}</p>
                <p><span className="text-muted-foreground">Status:</span> {alert.acknowledged ? "Acknowledged" : "Active"}</p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="cyber-card border-primary/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">AI Insights</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="gap-2"
              >
                {showAIInsights ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show
                  </>
                )}
              </Button>
            </div>

            {showAIInsights && (
              <div className="space-y-3">
                {aiLoading ? (
                  <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : aiError ? (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-2">AI Insights Unavailable</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Unable to generate AI insights at this time. Please try again.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetryAI}
                          className="gap-2"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm mb-3">
                      <strong>Root Cause Analysis:</strong> The disk space alert is likely caused by 
                      unrotated log files in /var/log/application. Review log rotation policy.
                    </p>
                    <p className="text-sm mb-3">
                      <strong>Recommendation:</strong> Implement automated log cleanup and consider 
                      increasing disk capacity or moving logs to external storage.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Impact:</strong> High - Critical service degradation risk if disk fills completely.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Throttle/Dedupe */}
          <div className="cyber-card">
            <h3 className="text-lg font-semibold mb-3">
              Throttle & Deduplication
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Occurrences:</span>
                <span className="font-medium">3 times in last hour</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">First Seen:</span>
                <span className="font-medium">45m ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Seen:</span>
                <span className="font-medium">{alert.duration} ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Throttle Status:</span>
                <Badge variant="secondary">Active</Badge>
              </div>
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
