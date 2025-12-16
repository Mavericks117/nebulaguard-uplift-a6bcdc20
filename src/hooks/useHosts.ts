import { useState, useEffect } from "react";

export interface Host {
  hostid: string;
  host: string;
  name: string;
  ip?: string;
  hostgroups: string;
  metrics: string;
  collected_at: string;
}

interface HostResponse {
  HostMetrics: Host;
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
        
        const data: HostResponse[] = await response.json();
        const extractedHosts = data.map((item) => item.HostMetrics);
        setHosts(extractedHosts);
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
