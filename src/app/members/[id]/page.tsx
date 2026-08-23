import React from 'react'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function PublicMemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Public Header */}
      <header className="border-b border-border/50 bg-card/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/PramanLogo.png" alt="Praman Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <h1 className="glow-text text-xl font-bold tracking-wider">PRAMAN CORE</h1>
          </div>
          <Link href="/" className="text-sm px-4 py-2 rounded-lg bg-input hover:bg-input/80 transition-colors border border-border">
            Back to Leaderboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-input rounded-full hover:bg-input/80 transition-colors border border-border">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Public Profile</span>
        </div>

        {/* Profile Card */}
        <div className="glass p-8 rounded-3xl border border-border flex flex-col md:flex-row items-center md:items-start justify-between gap-8 shadow-2xl shadow-primary/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl shadow-[0_0_30px_rgba(0,229,255,0.3)] border border-primary/30 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-foreground">{user.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{user.department}</p>
              
              {/* Social Links */}
              {(user.linkedinUrl || user.githubUrl || user.discordHandle) && (
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  {user.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all text-sm font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn
                    </a>
                  )}
                  {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground hover:text-background transition-all text-sm font-semibold border border-foreground/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
                    </a>
                  )}
                  {user.discordHandle && (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-sm font-semibold border border-[#5865F2]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> {user.discordHandle}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
                {user.roles.map(r => (
                  <span key={r.roleId} className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-xs font-semibold border border-border/50 uppercase tracking-wider">
                    {r.role.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-background/50 rounded-2xl p-6 border border-border text-center min-w-[200px] shadow-inner">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Points Earned</h3>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-sm">
              ✨ {totalPoints.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="glass rounded-2xl overflow-x-auto border border-border shadow-lg">
          <div className="p-6 border-b border-border/50 bg-card/40 backdrop-blur-sm flex justify-between items-center min-w-[600px]">
            <div>
              <h3 className="text-xl font-bold text-foreground">Points History (Audit Log)</h3>
              <p className="text-sm text-muted-foreground mt-1">A completely transparent record of contributions.</p>
            </div>
          </div>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-card/80">
                <th className="p-5 text-sm font-semibold text-muted-foreground w-48">Date & Time</th>
                <th className="p-5 text-sm font-semibold text-muted-foreground">Reason / Task</th>
                <th className="p-5 text-sm font-semibold text-muted-foreground w-32">Source Type</th>
                <th className="p-5 text-sm font-semibold text-primary text-right w-32">Points Awarded</th>
              </tr>
            </thead>
            <tbody>
              {user.pointHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-muted-foreground text-lg">No points awarded yet.</td>
                </tr>
              ) : user.pointHistory.map(record => (
                <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-5 text-sm text-muted-foreground font-medium">
                    {new Date(record.createdAt).toLocaleString()}
                  </td>
                  <td className="p-5">
                    <span className="font-semibold text-foreground text-base">{record.reason}</span>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider bg-input border border-border text-muted-foreground">
                      {record.sourceType || 'SYSTEM'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-black bg-primary/20 text-primary border border-primary/30">
                      +{record.points} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
