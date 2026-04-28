import { useQuery } from "@tanstack/react-query";
import { getPublicMetrics } from "@/api/metrics.api";

export function useMetrics() {
  return useQuery({
    queryKey: ["metrics", "public"],
    queryFn: getPublicMetrics,
    staleTime: 60 * 1000, // Cache for 1 minute
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
}
