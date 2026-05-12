import { AnalyticsDashboard } from "./_components/analytics-dashboard";

export default function RecruiterAnalyticsPage() {
  return <AnalyticsDashboard initialTimestamp={new Date().toISOString()} />;
}
