import { useState, useEffect } from "react";

export interface HostMetrics {
  cpu_percent: number | null;
  memory_percent: number | null;
  disk_percent: number | null;
  uptime_days: number | null;
  uptime_hours: number | null;
}

export interface Host {
  hostid: string;
  host: string;
  name: string;
  ip?: string;
  hostgroups: string[];
  metrics: HostMetrics;
  collected_at: string;
}

interface UseHostsReturn {
  hosts: Host[];
  isLoading: boolean;
  error: string | null;
}

export const useHosts = (): UseHostsReturn => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("http://10.100.12.54:5678/webhook/zabbix/host-details");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hosts: ${response.status}`);
        }
        
        // New format returns flat array directly
        const data: Host[] = await response.json();
        setHosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch hosts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHosts();
  }, []);

  return { hosts, isLoading, error };
};
