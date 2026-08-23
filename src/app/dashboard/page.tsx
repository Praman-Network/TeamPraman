import React from 'react'
import { db } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 0

export default async function DashboardPage() {
  // Fetch high-level statistics
  const activeMembersCount = await db.user.count({ where: { status: 'ACTIVE' } })
  const totalMeetings = await db.meeting.count()
  const totalIdeas = await db.idea.count()
  const totalTasks = await db.task.count({ where: { status: 'DONE' } })

  // Fetch recent point assignments as the "Activity Feed"
  const recentActivities = await db.pointHistory.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  // Fetch top 3 leaderboard
  let allUsers = await db.user.findMany({
    where: { status: 'ACTIVE' },
    include: { 
      pointHistory: true,
      roles: {
        include: { role: true }
      }
    }
  })

  // Find the founder (Admin user)
  const adminEmail = process.env.ADMIN_EMAIL
  let founder = allUsers.find(u => u.email === adminEmail)
  if (!founder) {
    founder = allUsers.find(u => u.name.toLowerCase().includes('rahul chaudhary'))
  }
  if (!founder) {
    founder = allUsers.find(u => u.roles.some(r => r.role.name === 'Founding Member'))
  }
  if (founder) {
    allUsers = allUsers.filter(u => u.id !== founder.id)
  }
  const topUsers = allUsers.map(user => {
    return {
      ...user,
      totalPoints: user.pointHistory.reduce((sum, p) => sum + p.points, 0)
    }
  }).sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 tracking-tight drop-shadow-sm">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Praman Core global overview & activities.</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Active Members</h3>
          <p className="text-4xl font-bold text-foreground relative z-10">{activeMembersCount}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Meetings</h3>
          <p className="text-4xl font-bold text-foreground relative z-10">{totalMeetings}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Ideas Logged</h3>
          <p className="text-4xl font-bold text-foreground relative z-10">{totalIdeas}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Tasks & PRs</h3>
          <p className="text-4xl font-bold text-foreground relative z-10">{totalTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Activity Feed
            </h2>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No activities logged yet.</p>
            ) : recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-input/30 border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                  {activity.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{activity.user.name}</span> was awarded{' '}
                    <span className="font-bold text-primary">✨ {activity.points} pts</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.reason}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Leaders */}
        <div className="glass p-6 rounded-2xl border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Top Contributors</h2>
            <Link href="/dashboard/leaderboard" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {topUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No members found.</p>
            ) : topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl border border-border/50 hover:bg-input/50 transition-colors">
                <div className="text-2xl w-8 text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{user.name}</p>
                  <p className="text-xs text-primary font-medium">✨ {user.totalPoints.toFixed(1)} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
