"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"


export default function DashboardPage() {
  return (
    <div>
      
      <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
      
    </div>
  );

  
  
}
