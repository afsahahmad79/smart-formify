// components/dashboard/DashboardStats.tsx

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DashboardStats() {
  const stats = useQuery(api.analytics.getSubmissionStats);

  if (!stats) return <div>Loading live stats…</div>;

  return (
    <div>
      <h3>Live Analytics</h3>
      <div>Total submissions: {stats.overview.totalSubmissions}</div>      {/* Add more fields as you expand your analytics */}
    </div>
  );
}