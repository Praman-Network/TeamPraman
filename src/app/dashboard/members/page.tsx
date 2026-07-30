import React from 'react'
import { db } from '@/lib/db'
import { addMember } from './actions'
import Link from 'next/link'

export default async function MembersPage() {
  const users = await db.user.findMany({
    include: {
      roles: {
        include: {
          role: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold glow-text">Members</h1>
          <p className="text-muted-foreground mt-1">Manage team members, roles, and profiles.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary glow-text">Add New Member</h3>
        <form action={addMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-foreground">Name</label>
            <input name="name" required placeholder="Alice" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">Email</label>
            <input name="email" type="email" required placeholder="alice@praman.network" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2 md:col-span-4">
            <label className="text-sm text-foreground">Roles (Select multiple)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-input border border-border rounded-lg p-4">
              {['Founding Member', 'Full Stack Developer', 'AI/ML Engineer', 'Web3 Developer', 'UI/UX Designer', 'Contributor'].map((role) => (
                <label key={role} className="flex items-center space-x-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" name="roles" value={role} className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4" />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">Department</label>
            <input name="department" required placeholder="Engineering" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">Date of Joining</label>
            <input name="joiningDate" type="date" required className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">End Date (Optional)</label>
            <input name="expectedEndDate" type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <button type="submit" className="glow bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium md:col-span-4 mt-2">
            Add Member
          </button>
        </form>
      </div>

      <div className="glass rounded-xl overflow-x-auto border border-border">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="p-4 text-sm font-medium text-muted-foreground">Name</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Department</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Joining Date</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Contract Left</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">No members found. Add one above!</td>
              </tr>
            ) : users.map(user => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {user.roles.map(r => (
                    <span key={r.roleId} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 mr-2">
                      {r.role.name}
                    </span>
                  ))}
                </td>
                <td className="p-4 text-sm text-foreground">{user.department}</td>
                <td className="p-4 text-sm text-foreground">
                  {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-sm text-foreground">
                  {(() => {
                    const isFounding = user.roles.some(r => r.role.name === 'Founding Member');
                    if (isFounding) return <span className="text-primary font-medium">Permanent</span>;
                    if (!user.expectedEndDate) return 'N/A';
                    
                    const now = new Date();
                    const endDate = new Date(user.expectedEndDate);
                    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    
                    if (daysLeft > 30) return <span className="text-green-500">{daysLeft} days</span>;
                    if (daysLeft > 0) return <span className="text-yellow-500 font-medium">{daysLeft} days</span>;
                    return <span className="text-red-500 font-bold">Expired</span>;
                  })()}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md text-xs font-medium">{user.status}</span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/dashboard/members/${user.id}`} className="text-xs px-3 py-1.5 bg-input text-foreground border border-border rounded-md hover:bg-primary/20 hover:text-primary transition-colors">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
