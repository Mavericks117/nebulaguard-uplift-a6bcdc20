import { useState, useMemo } from "react";
import { X, Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ReportItem } from "@/hooks/useReports";

interface ReportDrawerProps {
  report: ReportItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const sanitizeHtml = (html: string): string => {
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  return sanitized;
};

const ReportDrawer = ({ report, isOpen, onClose }: ReportDrawerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const sanitizedContent = useMemo(() => {
    if (!report?.report_template) return "";
    return sanitizeHtml(report.report_template);
  }, [report?.report_template]);

  const isLongContent = sanitizedContent.length > 2000;

  const handleDownloadPdf = async () => {
    if (!report) return;
    setIsGeneratingPdf(true);

    try {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <title>Sentramind Report - ${format(new Date(report.created_at), "PPP")}</title>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 1.2cm;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  margin: 0;
                  padding: 0;
                  color: #1a1a1a;
                  line-height: 1.6;
                }
                .container {
                  max-width: 100% !important;
                  width: 100%;
                  margin: 0 auto;
                  box-sizing: border-box;
                }
                table { 
                  width: 100%; 
                  page-break-inside: auto; 
                }
                tr { 
                  page-break-inside: avoid; 
                  page-break-after: auto; 
                }
                img { 
                  max-width: 100%; 
                  height: auto; 
                  page-break-inside: avoid; 
                }
                h1, h2, h3 { page-break-after: avoid; }
              </style>
            </head>
            <body>
              ${sanitizedContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        // Give time for images/styles to load
        setTimeout(() => {
          printWindow.print();
        }, 800);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "daily":    return "bg-primary/20 text-primary border-primary/30";
      case "weekly":   return "bg-secondary/20 text-secondary border-secondary/30";
      case "monthly":  return "bg-accent/20 text-accent border-accent/30";
      default:         return "bg-muted text-muted-foreground border-border";
    }
  };

  if (!isOpen || !report) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-4xl z-50
          bg-card/95 backdrop-blur-xl border-l border-border
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          shadow-2xl shadow-primary/10
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`${getTypeColor(report.report_type)} capitalize`}>
                  {report.report_type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Generated {format(new Date(report.created_at), "PPP 'at' p")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="hover-lift border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPdf ? "Generating..." : "PDF"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-88px)]">
          <div className="p-6">
            <div
              className={`
                prose prose-invert max-w-none
                bg-surface/30 rounded-xl p-6 border border-border/50
                overflow-x-auto
                ${!isExpanded && isLongContent ? "max-h-[60vh] overflow-hidden relative" : ""}
              `}
            >
              <div
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                className="report-content"
              />

              {!isExpanded && isLongContent && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface/90 to-transparent pointer-events-none" />
              )}
            </div>

            {isLongContent && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Read More
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <style>{`
        .report-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .report-content th,
        .report-content td {
          border: 1px solid hsl(var(--border));
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .report-content th {
          background: hsl(var(--muted));
          font-weight: 600;
        }
        .report-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        .report-content h1, .report-content h2, .report-content h3 {
          color: hsl(var(--foreground));
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .report-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .report-content ul, .report-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .report-content li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </>
  );
};

export default ReportDrawer;