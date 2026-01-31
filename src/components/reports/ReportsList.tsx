import { format } from "date-fns";
import { FileText, Calendar, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportItem } from "@/hooks/useReports";

interface ReportsListProps {
  reports: ReportItem[];
  loading: boolean;
  onReportClick: (report: ReportItem) => void;
}

const ReportsList = ({ reports, loading, onReportClick }: ReportsListProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-primary/20 text-primary border-primary/30";
      case "weekly":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "monthly":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getReportTitle = (report: ReportItem) => {
    const dateStr = format(new Date(report.created_at), "MMMM d, yyyy");
    switch (report.report_type) {
      case "daily":
        return `Daily System Health - ${dateStr}`;
      case "weekly":
        return `Weekly Performance Summary - ${format(new Date(report.created_at), "'Week of' MMMM d")}`;
      case "monthly":
        return `Monthly Availability Report - ${format(new Date(report.created_at), "MMMM yyyy")}`;
      default:
        return `${report.report_type} Report - ${dateStr}`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="glass-card p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No Reports Found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              No reports match your current filters. Try adjusting your search or date range.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <Card
          key={`${report.report_type}_${report.created_at}`}
          onClick={() => onReportClick(report)}
          className="glass-card p-6 cursor-pointer transition-all duration-300 hover:border-primary/30 hover-lift group"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {getReportTitle(report)}
                </h3>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`${getTypeColor(report.report_type)} capitalize`}>
                    {report.report_type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Generated {format(new Date(report.created_at), "PPP 'at' p")}</span>
                </div>
              </div>
            </div>
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              <span className="text-sm font-medium">View →</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;
