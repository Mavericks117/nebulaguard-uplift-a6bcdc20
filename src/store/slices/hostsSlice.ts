import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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

interface HostsState {
  hosts: Host[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: HostsState = {
  hosts: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const WEBHOOK_URL = "http://localhost:5678/webhook/zabbix/host-details";

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

// Async thunk for fetching hosts
export const fetchHosts = createAsyncThunk(
  "hosts/fetchHosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(WEBHOOK_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch hosts: ${response.status}`);
      }
      const rawData = await response.json();
      const data: Host[] = Array.isArray(rawData) ? rawData.map(transformHost) : [];
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch hosts");
    }
  }
);

// Silent fetch - doesn't set loading state
export const fetchHostsSilent = createAsyncThunk(
  "hosts/fetchHostsSilent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(WEBHOOK_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch hosts: ${response.status}`);
      }
      const rawData = await response.json();
      const data: Host[] = Array.isArray(rawData) ? rawData.map(transformHost) : [];
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch hosts");
    }
  }
);

const hostsSlice = createSlice({
  name: "hosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Regular fetch - with loading state
    builder
      .addCase(fetchHosts.pending, (state) => {
        // Only show loading if no cached data
        if (state.hosts.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchHosts.fulfilled, (state, action: PayloadAction<Host[]>) => {
        state.hosts = action.payload;
        state.loading = false;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchHosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Silent fetch - no loading state changes
      .addCase(fetchHostsSilent.fulfilled, (state, action: PayloadAction<Host[]>) => {
        // Smart update: only update if data changed (prevents flicker)
        const newData = JSON.stringify(action.payload);
        const oldData = JSON.stringify(state.hosts);
        if (newData !== oldData) {
          state.hosts = action.payload;
          state.lastUpdated = Date.now();
        }
        state.error = null;
      })
      .addCase(fetchHostsSilent.rejected, (state, action) => {
        // Keep old data visible on silent refresh error
        state.error = action.payload as string;
      });
  },
});

export default hostsSlice.reducer;

// Selectors
export const selectHosts = (state: { hosts: HostsState }) => state.hosts.hosts;
export const selectHostsLoading = (state: { hosts: HostsState }) => state.hosts.loading;
export const selectHostsError = (state: { hosts: HostsState }) => state.hosts.error;
export const selectHostsLastUpdated = (state: { hosts: HostsState }) => state.hosts.lastUpdated;
export const selectHostById = (id: string) => (state: { hosts: HostsState }) => 
  state.hosts.hosts.find((h) => h.hostid === id);
