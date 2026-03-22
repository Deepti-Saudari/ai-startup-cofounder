import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}