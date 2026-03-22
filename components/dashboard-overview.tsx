"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Lightbulb, TrendingUp, FileText, Calculator, ArrowRight, CheckCircle, Clock, AlertCircle,
  Rocket, Target, Users, DollarSign, Scale, Presentation, Wrench, Megaphone, Calendar,
  MessageSquare, Briefcase, Brain, Sparkles, Zap, BarChart, PieChart, Activity,
  Bell, Settings, User, Menu, X, Plus, Star, Award, Gift, Crown, Medal,
  ChevronRight, ExternalLink, Download, Share2, BookOpen, Globe, Shield,
  Coffee, Sunrise, Sunset, Moon, ThumbsUp, Heart, Smile, Filter
} from "lucide-react"

// Types for dashboard data
interface QuickAction {
  icon: any
  title: string
  description: string
  href: string
  color: string
  badge?: string
  progress?: number
}

interface MetricCard {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: any
  color: string
}

interface Activity {
  id: string
  type: "task" | "milestone" | "suggestion" | "alert"
  title: string
  description: string
  timestamp: string
  status?: "completed" | "in-progress" | "pending"
  icon?: any
  action?: string
  actionHref?: string
}

interface Insight {
  id: string
  title: string
  description: string
  category: "opportunity" | "risk" | "tip"
  action?: string
  actionHref?: string
}

interface Module {
  id: string
  name: string
  icon: any
  href: string
  color: string
  description: string
  progress: number
  isCompleted: boolean
  isActive: boolean
  timeEstimate: string
}

const modules: Module[] = [
  {
    id: "ideas",
    name: "Idea Generator",
    icon: Lightbulb,
    href: "/ideas",
    color: "from-yellow-500 to-orange-500",
    description: "Generate AI-powered startup ideas based on your skills",
    progress: 100,
    isCompleted: true,
    isActive: true,
    timeEstimate: "5 min"
  },
  {
    id: "market",
    name: "Market Research",
    icon: TrendingUp,
    href: "/market",
    color: "from-blue-500 to-cyan-500",
    description: "Analyze competitors, trends, and customer personas",
    progress: 60,
    isCompleted: false,
    isActive: true,
    timeEstimate: "15 min"
  },
  {
    id: "business",
    name: "Business Plan",
    icon: FileText,
    href: "/business-plan",
    color: "from-green-500 to-emerald-500",
    description: "Create comprehensive business plans and lean canvas",
    progress: 30,
    isCompleted: false,
    isActive: true,
    timeEstimate: "20 min"
  },
  {
    id: "financial",
    name: "Financial Model",
    icon: Calculator,
    href: "/financials",
    color: "from-purple-500 to-pink-500",
    description: "Revenue projections and unit economics",
    progress: 15,
    isCompleted: false,
    isActive: true,
    timeEstimate: "25 min"
  },
  {
    id: "legal",
    name: "Legal Documents",
    icon: Scale,
    href: "/legal",
    color: "from-red-500 to-rose-500",
    description: "Generate contracts, NDAs, and compliance templates",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "10 min"
  },
  {
    id: "pitch",
    name: "Pitch Deck",
    icon: Presentation,
    href: "/pitch-deck",
    color: "from-indigo-500 to-purple-500",
    description: "Create investor-ready presentations",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "30 min"
  },
  {
    id: "product",
    name: "Product Dev",
    icon: Wrench,
    href: "/product",
    color: "from-teal-500 to-green-500",
    description: "Plan MVP and development roadmap",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "20 min"
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    href: "/marketing",
    color: "from-orange-500 to-red-500",
    description: "Go-to-market strategy and growth plans",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "15 min"
  },
  {
    id: "funding",
    name: "Funding",
    icon: DollarSign,
    href: "/funding",
    color: "from-green-500 to-teal-500",
    description: "Fundraising strategy and investor matching",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "25 min"
  },
  {
    id: "team",
    name: "Team & Hiring",
    icon: Users,
    href: "/team",
    color: "from-blue-500 to-indigo-500",
    description: "Build your team structure",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "15 min"
  },
  {
    id: "roadmap",
    name: "Roadmap",
    icon: Calendar,
    href: "/roadmap",
    color: "from-purple-500 to-pink-500",
    description: "Track milestones and progress",
    progress: 25,
    isCompleted: false,
    isActive: true,
    timeEstimate: "10 min"
  },
  {
    id: "chat",
    name: "AI Co-Founder",
    icon: MessageSquare,
    href: "/chat",
    color: "from-cyan-500 to-blue-500",
    description: "Get real-time guidance",
    progress: 0,
    isCompleted: false,
    isActive: true,
    timeEstimate: "Ongoing"
  }
]

const metrics: MetricCard[] = [
  {
    title: "Startup Readiness",
    value: "45%",
    change: "+12%",
    trend: "up",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Tasks Completed",
    value: "24",
    change: "+8",
    trend: "up",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Active Projects",
    value: "3",
    change: "+2",
    trend: "up",
    icon: Target,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Time Saved",
    value: "47h",
    change: "+12h",
    trend: "up",
    icon: Clock,
    color: "from-orange-500 to-red-500"
  }
]

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "task",
    title: "Market Research Analysis",
    description: "Competitor analysis completed for SaaS idea",
    timestamp: "2 hours ago",
    status: "completed",
    icon: TrendingUp,
    action: "View Report",
    actionHref: "/market"
  },
  {
    id: "2",
    type: "milestone",
    title: "Business Plan Draft",
    description: "First draft of business plan is ready for review",
    timestamp: "1 day ago",
    status: "in-progress",
    icon: FileText,
    action: "Continue",
    actionHref: "/business-plan"
  },
  {
    id: "3",
    type: "suggestion",
    title: "New Investor Match",
    description: "3 new investors match your startup profile",
    timestamp: "2 days ago",
    icon: Users,
    action: "View Matches",
    actionHref: "/funding"
  }
]

const insights: Insight[] = [
  {
    id: "1",
    title: "Complete your financial model",
    description: "Having solid financial projections increases investor confidence by 73%",
    category: "opportunity",
    action: "Start Now",
    actionHref: "/financials"
  },
  {
    id: "2",
    title: "Market research incomplete",
    description: "You haven't analyzed your top 3 competitors yet",
    category: "risk",
    action: "Analyze",
    actionHref: "/market"
  },
  {
    id: "3",
    title: "Pitch deck template available",
    description: "Use our AI-powered template to create your pitch deck in 30 minutes",
    category: "tip",
    action: "Create",
    actionHref: "/pitch-deck"
  }
]

// Welcome messages based on time of day
const getWelcomeMessage = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  if (hour < 20) return "Good evening"
  return "Good night"
}

const getWelcomeIcon = () => {
  const hour = new Date().getHours()
  if (hour < 12) return <Sunrise className="w-5 h-5 text-yellow-500" />
  if (hour < 17) return <Sunset className="w-5 h-5 text-orange-500" />
  if (hour < 20) return <Sunset className="w-5 h-5 text-purple-500" />
  return <Moon className="w-5 h-5 text-indigo-500" />
}

export function DashboardOverview() {
  const [greeting, setGreeting] = useState("")
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null)
  const [showQuickStart, setShowQuickStart] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")

  useEffect(() => {
    setGreeting(getWelcomeMessage())
    setGreetingIcon(getWelcomeIcon())
  }, [])

  const completedModules = modules.filter(m => m.isCompleted).length
  const totalModules = modules.length
  const overallProgress = Math.round((completedModules / totalModules) * 100)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {greetingIcon}
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}, Founder
            </h1>
          </div>
          <p className="text-muted-foreground">
            Here's your startup progress and what needs your attention today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <span className={`text-xs font-medium ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold">Startup Completion Progress</h3>
              <p className="text-sm text-muted-foreground">
                You've completed {completedModules} of {totalModules} modules
              </p>
            </div>
            <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
              {overallProgress}%
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-2" />
          
          <div className="grid grid-cols-12 gap-1 mt-4">
            {modules.map((module, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${
                  module.isCompleted
                    ? "bg-green-500"
                    : module.progress > 0
                    ? "bg-yellow-500"
                    : "bg-gray-200"
                }`}
                title={`${module.name}: ${module.progress}%`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules Grid - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump back into your most important tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {modules.slice(0, 4).map((module) => (
                  <Button
                    key={module.id}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50"
                    asChild
                  >
                    <a href={module.href}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                        <module.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-center">{module.name}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Modules */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Your Startup Toolkit
                </CardTitle>
                <CardDescription>
                  All the tools you need to build your startup
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {modules.map((module) => (
                  <a
                    key={module.id}
                    href={module.href}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                      <module.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{module.name}</h4>
                        {module.isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {module.timeEstimate}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {module.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <Progress value={module.progress} className="h-1.5" />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {module.progress}%
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          {/* AI Assistant Card */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI Co-Founder</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your virtual business partner is here to help
                  </p>
                  <Button size="sm" className="w-full gap-2" asChild>
                    <a href="/chat">
                      <MessageSquare className="w-4 h-4" />
                      Start a conversation
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {activity.icon && <activity.icon className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      {activity.action && (
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                          <a href={activity.actionHref}>{activity.action} →</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insights & Recommendations */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4 text-primary" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg ${
                    insight.category === "opportunity"
                      ? "bg-green-50 border border-green-200"
                      : insight.category === "risk"
                      ? "bg-red-50 border border-red-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    {insight.category === "opportunity" && <Award className="w-4 h-4 text-green-600" />}
                    {insight.category === "risk" && <AlertCircle className="w-4 h-4 text-red-600" />}
                    {insight.category === "tip" && <Lightbulb className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  {insight.action && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                      <a href={insight.actionHref}>{insight.action} →</a>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Pro Tip</h4>
                  <p className="text-xs text-muted-foreground">
                    Complete your financial model to unlock investor matching and funding insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}