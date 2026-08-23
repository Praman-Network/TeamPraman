import React from 'react'
import Link from 'next/link'
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border/50 bg-card/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/PramanLogo.png" alt="Praman Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <h1 className="glow-text text-xl font-bold tracking-wider">PRAMAN CORE</h1>
          </Link>
          <Link href="/" className="text-sm px-4 py-2 rounded-lg bg-input text-foreground border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass w-full max-w-md rounded-2xl p-8 shadow-[0_0_40px_rgba(0,229,255,0.05)] border border-border/50">
          <div className="mb-8 text-center">
          <h1 className="glow-text text-3xl font-bold tracking-tight text-foreground">
            Praman Core
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to the internal operating system
          </p>
        </div>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="founder@praman.network"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>
          
          <div className="mt-6">
            <button
              formAction={login}
              className="glow w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold transition-colors hover:bg-primary/90"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}
