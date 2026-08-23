import React from 'react'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import { EditProfileModal } from '@/components/EditProfileModal'

export const revalidate = 0

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('mock_user_role')?.value === 'founder'
  
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
        <div className="glass p-6 rounded-2xl border border-border flex flex-col items-start gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl shadow-lg border border-primary/20 overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                {isAdmin && <EditProfileModal user={user} />}
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full border-t border-border/50 pt-4">
            {user.roles.map(r => (
              <span key={r.roleId} className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded text-xs font-medium border border-border/50">
                {r.role.name}
              </span>
            ))}
          </div>
          
          {/* Social Links */}
          {(user.linkedinUrl || user.githubUrl || user.discordHandle) && (
            <div className="flex flex-wrap gap-3 mt-2 w-full">
                  {user.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors text-xs font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
                    </a>
                  )}
                  {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-colors text-xs font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
                    </a>
                  )}
                  {user.discordHandle && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5865F2]/10 text-[#5865F2] text-xs font-semibold border border-[#5865F2]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> {user.discordHandle}
                    </div>
                  )}
            </div>
          )}
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
