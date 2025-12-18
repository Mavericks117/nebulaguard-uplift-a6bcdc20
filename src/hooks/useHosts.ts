import { useState, useEffect, useCallback, useRef } from "react";

export interface Host {
  hostid: string;
  hostname: string;
  ip: string | null;
  hostgroup: string;
  cpu_usage: string;        // e.g., "10.32%"
  memory_usage: string;     // e.g., "38.83%"
  disk_usage: string;       // e.g., "51.03%"
  uptime_days: string;      // e.g., "18.9 days"
  host_type: string;        // e.g., "linux", "vmware"
  last_checked: string;
  // optional fields
  memory_available_gb?: string;
  memory_total_gb?: string;
  disk_used_gb?: string;
  disk_total_gb?: string;
  memory_used_gb?: string;
}

interface UseHostsReturn {
  hosts: Host[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

const WEBHOOK_URL = "http://localhost:5678/webhook/zabbix/host-details";
const REFRESH_INTERVAL = 120000; // 2 minutes

export const useHosts = (): UseHostsReturn => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Only true on very first load
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const hostsRef = useRef<Host[]>([]); // Cache for instant display
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchHosts = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);

      const response = await fetch(WEBHOOK_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch hosts: ${response.status}`);
      }

      const data: Host[] = await response.json();

      // Smart update: only change if data is different (prevents flicker)
      if (JSON.stringify(data) !== JSON.stringify(hostsRef.current)) {
        hostsRef.current = data;
        setHosts(data);
        setLastUpdated(new Date());
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch hosts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch hosts");
      // Keep old data visible even on error
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Initial fetch — show loading only first time
  useEffect(() => {
    // If we have cached data from previous session, show it immediately
    if (hostsRef.current.length > 0) {
      setHosts(hostsRef.current);
      setIsLoading(false);
    }

    fetchHosts(false); // Full load with spinner if no cache
  }, [fetchHosts]);

  // Auto-refresh every 2 minutes — silent (no loading state)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchHosts(true); // Silent refresh
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchHosts]);

  const refresh = useCallback(async () => {
    await fetchHosts(false);
  }, [fetchHosts]);

  return {
    hosts,
    isLoading,     // Only true on very first load
    error,
    lastUpdated,
    refresh,
  };
};