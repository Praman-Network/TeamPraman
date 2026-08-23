import React from 'react'
import { db } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 0 // always fetch fresh data

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
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

  // Apply filter in memory
  if (isFoundingOnly) {
    users = users.filter(user => user.roles.some(r => r.role.name === 'Founding Member'))
  }

  // Find the founder (Admin user)
  const adminEmail = process.env.ADMIN_EMAIL
  let founder = users.find(u => u.email === adminEmail)
  if (!founder) {
    founder = users.find(u => u.name.toLowerCase().includes('rahul chaudhary'))
  }
  if (!founder) {
    founder = users.find(u => u.roles.some(r => r.role.name === 'Founding Member'))
  }

  // Remove founder from the list
  const filteredUsers = founder ? users.filter(u => u.id !== founder.id) : users

  // Calculate totals and sort in descending order
  const leaderboard = filteredUsers.map(user => {
    const totalPoints = user.pointHistory.reduce((sum, p) => sum + p.points, 0)
    return {
      ...user,
      totalPoints,
    }
  }).sort((a, b) => b.totalPoints - a.totalPoints) // sort by highest points first

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold glow-text">Team Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Ranking based on total contribution points.</p>
        </div>
        <div className="flex bg-input/50 rounded-lg p-1 border border-border shrink-0">
          <Link href="/dashboard/leaderboard" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isFoundingOnly ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}>
            All Members
          </Link>
          <Link href="/dashboard/leaderboard?filter=founding" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isFoundingOnly ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}>
            Founding Member
          </Link>
        </div>
      </div>

      <div className="glass rounded-xl overflow-x-auto border border-border">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="p-4 text-sm font-medium text-muted-foreground w-16 text-center">Rank</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Member</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Primary Role</th>
              <th className="p-4 text-sm font-medium text-primary text-right">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">No active members found for this filter.</td>
              </tr>
            ) : leaderboard.map((user, index) => {
              const rank = index + 1;
              let rankBadge = <span className="text-muted-foreground font-medium text-lg">#{rank}</span>;
              
              if (rank === 1) rankBadge = <span className="text-yellow-400 text-2xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" title="1st Place">🥇</span>;
              else if (rank === 2) rankBadge = <span className="text-gray-300 text-2xl drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]" title="2nd Place">🥈</span>;
              else if (rank === 3) rankBadge = <span className="text-amber-600 text-2xl drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" title="3rd Place">🥉</span>;

              return (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-center align-middle">
                    {rankBadge}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md overflow-hidden
                        ${rank === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' : 
                          rank === 2 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' : 
                          rank === 3 ? 'bg-amber-600/20 text-amber-600 border border-amber-600/50' : 
                          'bg-primary/20 text-primary border border-primary/20'}`}
                      >
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-lg tracking-tight">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.roles.length > 0 ? (
                      <span className="px-2 py-1 bg-secondary/50 rounded text-xs">
                        {user.roles[0].role.name}
                        {user.roles.length > 1 && ` +${user.roles.length - 1}`}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                      ✨ {user.totalPoints.toFixed(1)} pts
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
