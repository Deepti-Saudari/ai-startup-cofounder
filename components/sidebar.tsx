"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  FileText,
  Calculator,
  Scale,
  Presentation as PresentationChart,
  Wrench,
  Megaphone,
  DollarSign,
  Users,
  Calendar,
  MessageSquare,
  CheckSquare,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Lightbulb, label: "Idea Generator", href: "/ideas" },
  { icon: TrendingUp, label: "Market Research", href: "/market" },
  { icon: FileText, label: "Business Plan", href: "/business-plan" },
  { icon: Calculator, label: "Financial Model", href: "/financials" },
  { icon: Scale, label: "Legal Docs", href: "/legal" },
  { icon: PresentationChart, label: "Pitch Deck", href: "/pitch-deck" },
  { icon: Wrench, label: "Product Dev", href: "/product" },
  { icon: Megaphone, label: "Marketing", href: "/marketing" },
  { icon: DollarSign, label: "Funding", href: "/funding" },
  { icon: Users, label: "Team & Hiring", href: "/team" },
  { icon: Calendar, label: "Roadmap", href: "/roadmap" },
  { icon: CheckSquare, label: "Operations", href: "/operations" },
  { icon: MessageSquare, label: "AI Co-Founder", href: "/chat" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">AI Co-Founder</h1>
            <p className="text-xs text-muted-foreground">Your Virtual Business Partner</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
