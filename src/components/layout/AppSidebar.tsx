'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Video, 
  Lightbulb, 
  KanbanSquare, 
  Award, 
  TrendingUp, 
  Settings 
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/dashboard/members', icon: Users },
  { name: 'Meetings', href: '/dashboard/meetings', icon: Video },
  { name: 'Ideas', href: '/dashboard/ideas', icon: Lightbulb },
  { name: 'Tasks', href: '/dashboard/tasks', icon: KanbanSquare },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Award },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="glass w-full md:w-64 h-auto md:h-screen sticky md:fixed left-0 top-0 flex flex-row md:flex-col border-b md:border-r border-border z-40 bg-card/60 overflow-x-auto md:overflow-visible">
      <div className="p-4 md:p-6 border-r md:border-r-0 md:border-b border-border flex items-center gap-3 shrink-0">
        <img src="/PramanLogo.png" alt="Praman Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
        <h2 className="glow-text text-xl font-bold tracking-wider text-foreground">CORE</h2>
      </div>

      <nav className="flex-1 overflow-x-auto md:overflow-y-auto p-2 md:p-4 flex flex-row md:flex-col gap-1 md:space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
                isActive 
                  ? 'bg-primary/10 text-primary glow-text border border-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Link 
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  )
}
