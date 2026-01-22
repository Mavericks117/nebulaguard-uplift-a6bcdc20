import { useMemo, useState } from "react";

import UserLayout from "@/layouts/UserLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HardDrive, RefreshCw, TriangleAlert } from "lucide-react";

import { useBackupReplication } from "@/hooks/useBackupReplication";
import BackupReplicationSummary from "@/pages/user/backup-replication/components/BackupReplicationSummary";
import VmProtectionTable from "@/pages/user/backup-replication/components/VmProtectionTable";
import type { MatchedVm } from "@/pages/user/backup-replication/types";

const BackupReplication = () => {
  const { summary, matched, loading, error, refresh, lastUpdatedAt } = useBackupReplication();
  const [query, setQuery] = useState("");

  const filteredMatched = useMemo<MatchedVm[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matched;
    return matched.filter((m) => m.vm?.name?.toLowerCase?.().includes(q));
  }, [matched, query]);

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <HardDrive className="w-6 h-6 text-primary glow-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Backup &amp; Replication</h1>
              <p className="text-muted-foreground">VM protection status and job health</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdatedAt && (
              <Badge variant="secondary" className="bg-surface/50 border border-border/50">
                Updated: {lastUpdatedAt.toLocaleTimeString()}
              </Badge>
            )}
            <Button onClick={() => void refresh()} variant="outline" className="hover-lift" disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary */}
        <BackupReplicationSummary summary={summary} loading={loading} />

        {/* Primary table */}
        <Card className="glass-card p-6 rounded-lg border border-border">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">VM Protection View</h2>
              <p className="text-sm text-muted-foreground">Expandable rows show jobs per VM</p>
            </div>
            <div className="w-full lg:w-[420px]">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search VM name…"
                className="bg-surface/50 border-border/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <TriangleAlert className="w-5 h-5 text-destructive mt-0.5" />
                <div className="space-y-1">
                  <div className="font-medium">Failed to load Backup &amp; Replication data</div>
                  <div className="text-sm text-muted-foreground">{error}</div>
                </div>
              </div>
            </div>
          ) : (
            <VmProtectionTable matched={filteredMatched} loading={loading} />
          )}
        </Card>
      </div>
    </UserLayout>
  );
};

export default BackupReplication;
