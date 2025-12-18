import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchHosts,
  fetchHostsSilent,
  selectHosts,
  selectHostsLoading,
  selectHostsError,
  selectHostsLastUpdated,
  Host,
} from "@/store/slices/hostsSlice";
import type { AppDispatch } from "@/store";

const REFRESH_INTERVAL = 120000; // 2 minutes

export type { Host };

interface UseHostsReturn {
  hosts: Host[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export const useHosts = (): UseHostsReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const hosts = useSelector(selectHosts);
  const isLoading = useSelector(selectHostsLoading);
  const error = useSelector(selectHostsError);
  const lastUpdatedTimestamp = useSelector(selectHostsLastUpdated);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialFetchDone = useRef(false);

  // Initial fetch - only if no cached data or stale
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      if (hosts.length === 0) {
        // No cache - do regular fetch with loading
        dispatch(fetchHosts());
      } else {
        // Have cache - do silent background refresh
        dispatch(fetchHostsSilent());
      }
    }
  }, [dispatch, hosts.length]);

  // Auto-refresh every 2 minutes — silent (no loading state)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      dispatch(fetchHostsSilent());
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]);

  const refresh = useCallback(async () => {
    await dispatch(fetchHosts());
  }, [dispatch]);

  return {
    hosts,
    isLoading,
    error,
    lastUpdated: lastUpdatedTimestamp ? new Date(lastUpdatedTimestamp) : null,
    refresh,
  };
};
