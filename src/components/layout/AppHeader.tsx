'use client'

import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'

export default function AppHeader() {
  return (
    <header className="glass h-16 sticky top-0 z-30 flex items-center justify-between px-6 border-b border-border bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-input border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all w-64">
          <Search size={16} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search Praman Core..." 
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full glow"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[2px]">
          <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-foreground">RC</span>
          </div>
        </div>
      </div>
    </header>
  )
}
