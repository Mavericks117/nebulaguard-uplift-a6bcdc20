import { FileText, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReportCounts } from "@/hooks/useReports";

interface ReportSummaryCardsProps {
  counts: ReportCounts;
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const ReportSummaryCards = ({ counts, selectedType, onTypeSelect }: ReportSummaryCardsProps) => {
  const cards = [
    {
      id: "all",
      label: "Total Reports",
      value: counts.total,
      icon: FileText,
      color: "primary",
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "daily",
      label: "Daily Reports",
      value: counts.daily,
      icon: Calendar,
      color: "primary",
      gradient: "from-primary/15 to-transparent",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "weekly",
      label: "Weekly Reports",
      value: counts.weekly,
      icon: CalendarDays,
      color: "secondary",
      gradient: "from-secondary/15 to-transparent",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      id: "monthly",
      label: "Monthly Reports",
      value: counts.monthly,
      icon: CalendarRange,
      color: "accent",
      gradient: "from-accent/15 to-transparent",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedType === card.id;

        return (
          <Card
            key={card.id}
            onClick={() => onTypeSelect(card.id)}
            className={`
              glass-card p-4 cursor-pointer transition-all duration-300 hover-lift
              border-2 ${isSelected ? `border-${card.color} glow-${card.color}` : "border-transparent"}
              bg-gradient-to-br ${card.gradient}
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                <p className="text-3xl font-bold mt-1 text-foreground">{card.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportSummaryCards;
