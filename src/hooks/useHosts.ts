import { useState, useEffect, useCallback, useRef } from "react";

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
  ip: string | null;
  hostgroups: string[];
  metrics: HostMetrics | null;
  collected_at: string;
  // Computed display fields
  hostname: string;
  hostgroup: string;
  cpu_usage: string;
  memory_usage: string;
  disk_usage: string;
  uptime_days: string;
  host_type: string;
  last_checked: string;
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
const STORAGE_KEY = "jarvis_hosts_cache";

// Infer host type from name
const inferHostType = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("ubuntu") || lower.includes("centos") || lower.includes("debian") || lower.includes("linux")) return "linux";
  if (lower.includes("windows") || lower.includes("win")) return "windows";
  if (lower.includes("vmware") || lower.includes("esxi")) return "vmware";
  if (lower.includes("zabbix")) return "linux";
  return "linux";
};

// Transform raw API data to Host with computed fields
const transformHost = (raw: any): Host => {
  const metrics = raw.metrics || null;
  return {
    ...raw,
    hostgroups: raw.hostgroups || [],
    metrics,
    // Computed display fields for backward compatibility
    hostname: raw.name || raw.host,
    hostgroup: Array.isArray(raw.hostgroups) ? raw.hostgroups.join(", ") : "Uncategorized",
    cpu_usage: metrics?.cpu_percent != null ? `${metrics.cpu_percent.toFixed(1)}%` : "N/A",
    memory_usage: metrics?.memory_percent != null ? `${metrics.memory_percent.toFixed(1)}%` : "N/A",
    disk_usage: metrics?.disk_percent != null ? `${metrics.disk_percent.toFixed(1)}%` : "N/A",
    uptime_days: metrics?.uptime_days != null 
      ? `${metrics.uptime_days}d ${metrics.uptime_hours ?? 0}h` 
      : "N/A",
    host_type: inferHostType(raw.name || raw.host),
    last_checked: raw.collected_at || new Date().toISOString(),
  };
};

// Load from localStorage cache
const loadFromCache = (): Host[] => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.hosts || [];
    }
  } catch (e) {
    console.warn("Failed to load hosts cache:", e);
  }
  return [];
};

// Save to localStorage cache
const saveToCache = (hosts: Host[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hosts, timestamp: Date.now() }));
  } catch (e) {
    console.warn("Failed to save hosts cache:", e);
  }
};

export const useHosts = (): UseHostsReturn => {
  // Initialize from cache for instant display
  const [hosts, setHosts] = useState<Host[]>(() => loadFromCache());
  const [isLoading, setIsLoading] = useState(() => loadFromCache().length === 0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const hostsRef = useRef<Host[]>(hosts);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchHosts = useCallback(async (silent = false) => {
    try {
      if (!silent && hostsRef.current.length === 0) setIsLoading(true);

      const response = await fetch(WEBHOOK_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch hosts: ${response.status}`);
      }

      const rawData = await response.json();
      const data: Host[] = Array.isArray(rawData) ? rawData.map(transformHost) : [];

      // Smart update: only change if data is different (prevents flicker)
      if (JSON.stringify(data) !== JSON.stringify(hostsRef.current)) {
        hostsRef.current = data;
        setHosts(data);
        saveToCache(data);
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

  // Initial fetch
  useEffect(() => {
    fetchHosts(hostsRef.current.length > 0); // Silent if we have cache
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
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
};