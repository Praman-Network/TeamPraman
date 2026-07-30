import React from 'react'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const user = await db.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      roles: {
        include: { role: true }
      },
      pointHistory: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    return notFound()
  }

  const totalPoints = user.pointHistory.reduce((sum, record) => sum + record.points, 0)
  const isFounding = user.roles.some(r => r.role.name === 'Founding Member')

  let daysLeftText = 'N/A'
  if (isFounding) {
    daysLeftText = 'Permanent'
  } else if (user.expectedEndDate) {
    const daysLeft = Math.ceil((new Date(user.expectedEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft > 0) {
      daysLeftText = `${daysLeft} days remaining`
    } else {
      daysLeftText = 'Contract Expired'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/50 pb-6">
        <Link href="/dashboard/members" className="p-2 bg-input rounded-lg hover:bg-input/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
            {user.name}'s Profile
          </h1>
          <p className="text-muted-foreground mt-1">Detailed performance and points audit log.</p>
        </div>
      </div>

      {/* Member Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="glass p-6 rounded-2xl border border-border flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl shadow-lg border border-primary/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.roles.map(r => (
                <span key={r.roleId} className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded text-xs font-medium border border-border/50">
                  {r.role.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="glass p-6 rounded-2xl border border-border relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Points Earned</h3>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 relative z-10 drop-shadow-md">
            ✨ {totalPoints.toFixed(1)}
          </p>
        </div>

        {/* Contract Info */}
        <div className="glass p-6 rounded-2xl border border-border flex flex-col justify-center">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Department</p>
              <p className="text-lg font-medium text-foreground">{user.department}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Contract Status</p>
              <p className={`text-lg font-medium ${daysLeftText === 'Permanent' ? 'text-primary' : daysLeftText === 'Contract Expired' ? 'text-red-500' : 'text-yellow-500'}`}>
                {daysLeftText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass rounded-xl overflow-x-auto border border-border">
        <div className="p-4 border-b border-border/50 bg-card/30 min-w-[600px]">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Points History (Audit Log)
          </h3>
        </div>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="p-4 text-sm font-medium text-muted-foreground w-48">Date & Time</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Reason / Task</th>
              <th className="p-4 text-sm font-medium text-muted-foreground w-32">Source Type</th>
              <th className="p-4 text-sm font-medium text-primary text-right w-32">Points Added</th>
            </tr>
          </thead>
          <tbody>
            {user.pointHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">No points awarded yet.</td>
              </tr>
            ) : user.pointHistory.map(record => (
              <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">{record.reason}</span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-input border border-border text-muted-foreground">
                    {record.sourceType || 'SYSTEM'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                    +{record.points} pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
