import React from 'react'
import { db } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 0

export default async function PublicLeaderboardPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  const isFoundingOnly = resolvedParams.filter === 'founding';

  // Fetch all active users with their points
  let users = await db.user.findMany({
    where: { status: 'ACTIVE' },
    include: {
      pointHistory: true,
      roles: {
        include: { role: true }
      }
    }
  })

  // Apply filter
  if (isFoundingOnly) {
    users = users.filter(user => user.roles.some(r => r.role.name === 'Founding Member'))
  }

  // Calculate totals and sort
  const leaderboard = users.map(user => {
    const totalPoints = user.pointHistory.reduce((sum, p) => sum + p.points, 0)
    return {
      ...user,
      totalPoints,
    }
  }).sort((a, b) => b.totalPoints - a.totalPoints)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Public Header */}
      <header className="border-b border-border/50 bg-card/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/PramanLogo.png" alt="Praman Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <h1 className="glow-text text-xl font-bold tracking-wider">PRAMAN CORE</h1>
          </div>
          <Link href="/dashboard" className="text-sm px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
            Admin Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-sm">
            Global Leaderboard
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our top contributors. The ranking is based on automated points assigned through meetings, tasks, and ideas.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="flex bg-input/50 rounded-lg p-1 border border-border">
            <Link href="/" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isFoundingOnly ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}>
              All Members
            </Link>
            <Link href="/?filter=founding" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isFoundingOnly ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}>
              Founders Only
            </Link>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-x-auto border border-border shadow-2xl shadow-primary/5">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-card/80 backdrop-blur-md">
                <th className="p-5 text-sm font-medium text-muted-foreground w-20 text-center">Rank</th>
                <th className="p-5 text-sm font-medium text-muted-foreground">Member</th>
                <th className="p-5 text-sm font-medium text-muted-foreground">Primary Role</th>
                <th className="p-5 text-sm font-medium text-primary text-right">Total Points</th>
                <th className="p-5 text-sm font-medium text-muted-foreground text-right">Profile</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground">No active members found.</td>
                </tr>
              ) : leaderboard.map((user, index) => {
                const rank = index + 1;
                let rankBadge = <span className="text-muted-foreground font-medium text-lg">#{rank}</span>;
                
                if (rank === 1) rankBadge = <span className="text-yellow-400 text-2xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" title="1st Place">🥇</span>;
                else if (rank === 2) rankBadge = <span className="text-gray-300 text-2xl drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]" title="2nd Place">🥈</span>;
                else if (rank === 3) rankBadge = <span className="text-amber-600 text-2xl drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" title="3rd Place">🥉</span>;

                return (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                    <td className="p-5 text-center align-middle">
                      {rankBadge}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg text-lg
                          ${rank === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 
                            rank === 2 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' : 
                            rank === 3 ? 'bg-amber-600/20 text-amber-600 border border-amber-600/50' : 
                            'bg-primary/20 text-primary border border-primary/20'}`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-muted-foreground">
                      {user.roles.length > 0 ? (
                        <span className="px-3 py-1 bg-secondary/50 rounded-md text-xs border border-border/50">
                          {user.roles[0].role.name}
                          {user.roles.length > 1 && ` +${user.roles.length - 1}`}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                        ✨ {user.totalPoints.toFixed(1)} pts
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <Link href={`/members/${user.id}`} className="text-xs font-semibold px-4 py-2 bg-input text-foreground border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
