import React from 'react'
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="glass w-full max-w-md rounded-2xl p-8">
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
          
          <div className="flex gap-4 mt-6">
            <button
              formAction={login}
              className="glow flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold transition-colors hover:bg-primary/90"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-foreground font-semibold transition-colors hover:bg-muted"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
