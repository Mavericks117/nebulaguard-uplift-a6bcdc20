import { useSelector } from "react-redux";
import UserLayout from "@/layouts/UserLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Server, Activity, HardDrive, Cpu } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectHosts,
  selectHostsLoading,
  selectHostsError,
} from "@/store/slices/hostsSlice";
import { useHosts } from "@/hooks/useHosts";

const capitalizeHostType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const UserHostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Initialize the hook to ensure fetch cycle is running
  useHosts();

  // Read directly from Redux store - instant access to cached data
  const hosts = useSelector(selectHosts);
  const isLoading = useSelector(selectHostsLoading);
  const error = useSelector(selectHostsError);

  const host = hosts.find((h) => h.hostid === id);

  // Only show loading if no cached data at all
  if (isLoading && hosts.length === 0) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading host details...</p>
        </div>
      </UserLayout>
    );
  }

  if ((error && hosts.length === 0) || !host) {
    return (
      <UserLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/hosts")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-destructive">Host not found</h1>
          </div>
          <p className="text-muted-foreground">
            {error || "The requested host could not be found."}
          </p>
        </div>
      </UserLayout>
    );
  }

  const displayName = host.hostname;
  const displayIP = host.ip || "—";
  const displayOS = capitalizeHostType(host.host_type);

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/hosts")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {displayName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {displayIP} • {displayOS}
              </p>
            </div>
          </div>
          <Badge variant="default" className="gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
            Online
          </Badge>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold mt-1">{host.cpu_usage}</p>
              </div>
              <Cpu className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Memory</p>
                <p className="text-2xl font-bold mt-1">{host.memory_usage}</p>
              </div>
              <Activity className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disk Usage</p>
                <p className="text-2xl font-bold mt-1">{host.disk_usage}</p>
              </div>
              <HardDrive className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold mt-1">{host.uptime_days}</p>
              </div>
              <Server className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold mb-4">Host Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hostname</p>
                  <p className="font-medium">{displayName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-medium">{displayIP}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">OS</p>
                  <p className="font-medium">{displayOS}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-medium">{host.uptime_days}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold mb-4">Real-time Metrics</h3>
              <p className="text-muted-foreground">Live metrics visualization would appear here</p>
            </Card>
          </TabsContent>

          <TabsContent value="triggers">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold mb-4">Trigger History</h3>
              <p className="text-muted-foreground">Trigger history would appear here</p>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
              <p className="text-muted-foreground">AI insights and recommendations would appear here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default UserHostDetail;
