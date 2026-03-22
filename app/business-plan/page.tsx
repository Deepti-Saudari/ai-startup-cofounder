import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { BusinessPlan } from "@/components/business-plan"

export default function BusinessPlanPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <BusinessPlan />
        </main>
      </div>
    </div>
  )
}
