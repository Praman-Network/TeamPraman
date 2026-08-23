import React from 'react'
import { db } from '@/lib/db'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const revalidate = 0

export default async function PublicLeaderboardPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  const isFoundingOnly = resolvedParams.filter === 'founding';
  
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('mock_user_role')?.value === 'founder'

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

  // Find the founder for the bottom section (Admin user)
  const adminEmail = process.env.ADMIN_EMAIL
  let founder = users.find(u => u.email === adminEmail)
  if (!founder) {
    founder = users.find(u => u.name.toLowerCase().includes('rahul chaudhary'))
  }
  if (!founder) {
    founder = users.find(u => u.roles.some(r => r.role.name === 'Founding Member'))
  }
  
  const founderName = founder?.name || 'Rahul Chaudhary'
  const founderAvatar = founder?.avatarUrl
  const founderLinkedin = founder?.linkedinUrl || 'https://www.linkedin.com/in/rahul-chaudhary-b31b2a297/'
  const founderGithub = founder?.githubUrl || 'https://github.com/Rahulchaudharyji2'
  const founderInitial = founderName.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() || 'RC'

  // Remove founder from the list
  const filteredUsers = founder ? users.filter(u => u.id !== founder.id) : users

  // Calculate totals and sort
  const leaderboard = filteredUsers.map(user => {
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
          <Link href="/login" className="text-sm px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
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
              Founding Member
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
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg text-lg overflow-hidden
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
        <div className="mt-20 py-12 border-t border-border/30">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-sm">
              Meet The Founder
            </h2>
          </div>
          <div className="max-w-3xl mx-auto glass rounded-3xl p-8 border border-border shadow-[0_0_40px_rgba(0,229,255,0.1)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:shadow-[0_0_60px_rgba(0,229,255,0.15)] transition-shadow duration-500">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500"></div>
            
            <div className="w-36 h-36 shrink-0 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-600 p-1 shadow-[0_0_20px_rgba(0,229,255,0.4)] transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-500 overflow-hidden">
                {founderAvatar ? (
                  <img src={founderAvatar} alt={founderName} className="w-full h-full object-cover" />
                ) : (
                  founderInitial
                )}
              </div>
            </div>
            
            <div className="text-center md:text-left z-10 w-full">
              <h3 className="text-3xl font-bold text-foreground tracking-tight">{founderName}</h3>
              <p className="text-primary mt-1 mb-4 font-semibold tracking-wider text-sm uppercase">Founding Member & Software Engineer</p>
              <p className="text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                Building Praman Network to redefine privacy-preserving digital identity and authentication. Passionate about turning complex Web3 and zero-knowledge technologies into seamless, secure, and developer-friendly products that make decentralized identity more accessible.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a href={founderLinkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/30 hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm hover:shadow-[#0077b5]/50 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <span className="text-sm font-semibold">LinkedIn</span>
                </a>
                <a href={founderGithub} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground/5 text-foreground border border-border hover:bg-foreground hover:text-background transition-all duration-300 shadow-sm hover:shadow-foreground/30 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span className="text-sm font-semibold">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
