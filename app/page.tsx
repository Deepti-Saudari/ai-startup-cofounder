import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import StartupBuilder from "@/components/startup-builder"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <DashboardHeader />

        <main className="flex-1 p-6 space-y-6">

          <DashboardOverview />

          {/* Startup Builder Section */}
          <StartupBuilder />

        </main>

      </div>

    </div>
  )
}