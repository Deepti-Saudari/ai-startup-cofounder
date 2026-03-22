"use client"

import { Button } from "@/components/ui/button"
import { Bell, Settings, User, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const pageNames: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Dashboard",
    description: "Your startup command center",
  },
  "/ideas": {
    title: "Idea Generator",
    description: "Generate AI-powered startup ideas",
  },
  "/market": {
    title: "Market Research",
    description: "Analyze competitors and trends",
  },
  "/business-plan": {
    title: "Business Plan",
    description: "Create comprehensive business plans",
  },
  "/financials": {
    title: "Financial Model",
    description: "Build revenue projections",
  },
  "/legal": {
    title: "Legal Documents",
    description: "Generate contracts and templates",
  },
  "/pitch-deck": {
    title: "Pitch Deck",
    description: "Create investor presentations",
  },
  "/product": {
    title: "Product Development",
    description: "Plan your MVP and roadmap",
  },
  "/marketing": {
    title: "Marketing Strategy",
    description: "Go-to-market and growth plans",
  },
  "/funding": {
    title: "Funding Strategy",
    description: "Find and attract investors",
  },
  "/team": {
    title: "Team & Hiring",
    description: "Build your dream team",
  },
  "/roadmap": {
    title: "Startup Roadmap",
    description: "Track milestones and progress",
  },
  "/chat": {
    title: "AI Co-Founder",
    description: "Chat with your AI business partner",
  },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const pageInfo = pageNames[pathname] || { title: "Dashboard", description: "Your startup command center" }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{pageInfo.title}</h1>
          <p className="text-sm text-muted-foreground">{pageInfo.description}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-8 bg-muted/50"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-2 px-3 text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}