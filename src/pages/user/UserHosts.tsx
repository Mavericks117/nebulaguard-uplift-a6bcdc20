import { useState } from "react";
import { useSelector } from "react-redux";
import UserLayout from "@/layouts/UserLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Server, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  selectHosts,
  selectHostsLoading,
  selectHostsError,
} from "@/store/slices/hostsSlice";
import { useHosts } from "@/hooks/useHosts";

const UserHosts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Initialize the hook to start fetch cycle
  useHosts();

  // Read directly from Redux store
  const hosts = useSelector(selectHosts);
  const isLoading = useSelector(selectHostsLoading);
  const error = useSelector(selectHostsError);

  const mappedHosts = hosts.map((host) => ({
    id: host.hostid,
    name: host.hostname,
    ip: host.ip || "—",
    status: "online",
    problems: 0,
    group: host.hostgroup,
  }));

  const groups = Array.from(new Set(hosts.flatMap((h) => h.hostgroups || [])));

  const filteredHosts = mappedHosts.filter((host) => {
    const matchesSearch =
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.ip.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = !selectedGroup || host.group === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Hosts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your infrastructure hosts
            </p>
          </div>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search hosts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-surface/50 border-border/50"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={selectedGroup === null ? "default" : "outline"}
              onClick={() => setSelectedGroup(null)}
              className={selectedGroup === null ? "bg-primary" : ""}
            >
              All
            </Button>
            {groups.map((group) => (
              <Button
                key={group}
                variant={selectedGroup === group ? "default" : "outline"}
                onClick={() => setSelectedGroup(group)}
                className={selectedGroup === group ? "bg-primary" : ""}
              >
                {group}
              </Button>
            ))}
          </div>

          {isLoading && hosts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && hosts.length === 0 && (
            <div className="flex items-center justify-center py-12 text-destructive">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {(!isLoading || hosts.length > 0) && !error && (
            <div className="space-y-3">
              {filteredHosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No hosts found matching your search.
                </div>
              ) : (
                filteredHosts.map((host) => (
                  <div
                    key={host.id}
                    onClick={() => navigate(`/dashboard/hosts/${host.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Server className="w-6 h-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{host.name}</h3>
                        <p className="text-sm text-muted-foreground">{host.ip}</p>
                        <p className="text-xs text-muted-foreground mt-1">{host.group}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {host.problems > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {host.problems} problems
                        </Badge>
                      )}
                      <Badge
                        variant={host.status === "online" ? "default" : "secondary"}
                        className="gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {host.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserHosts;
