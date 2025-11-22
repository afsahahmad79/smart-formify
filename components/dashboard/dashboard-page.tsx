"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardStats } from "./dashboard-stats";

export default function DashboardPage() {
  return (
    <div>
      <DashboardStats />
      <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
      
    </div>
  );

  
  
}
