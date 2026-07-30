import React from 'react'
import { db } from '@/lib/db'
import { logContribution } from './actions'

export default async function TasksPage() {
  const tasks = await db.task.findMany({
    where: { status: 'DONE' },
    include: {
      assignee: true,
      pointHistory: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const allUsers = await db.user.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' }
  })

  // Removed hardcoded getPoints function since we now fetch actual points

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold glow-text">Tasks & Contributions</h1>
          <p className="text-muted-foreground mt-1">Log completed work, PRs, and issues to award points.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary glow-text">Log a Contribution</h3>
        <form action={logContribution} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          
          <div className="space-y-2">
            <label className="text-sm text-foreground">Team Member</label>
            <select name="assigneeId" required className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none">
              <option value="">Select member...</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-4">
            <label className="text-sm text-foreground">Contribution Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-input transition-colors">
                <input type="radio" name="contributionType" value="UI_UX" required className="mr-2 text-primary focus:ring-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Complete UI/UX</span>
                  <span className="text-xs text-primary">+5 Points</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-input transition-colors">
                <input type="radio" name="contributionType" value="PR_MERGED" className="mr-2 text-primary focus:ring-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">PR Merged</span>
                  <span className="text-xs text-primary">+3 Points</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-input transition-colors">
                <input type="radio" name="contributionType" value="IMPLEMENTATION_PLAN" className="mr-2 text-primary focus:ring-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Impl. Plan</span>
                  <span className="text-xs text-primary">+3 Points</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-input transition-colors">
                <input type="radio" name="contributionType" value="ISSUE_RAISED" className="mr-2 text-primary focus:ring-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Issue Raised</span>
                  <span className="text-xs text-primary">+2 Points</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-input transition-colors">
                <input type="radio" name="contributionType" value="PART_BUILT" className="mr-2 text-primary focus:ring-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Part Built</span>
                  <span className="text-xs text-primary">+1.5 Points</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-input transition-colors">
                <input type="radio" name="contributionType" value="CUSTOM" className="mr-2 text-primary focus:ring-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Custom Points</span>
                  <span className="text-xs text-primary">Specify below</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="text-sm text-foreground">Custom Points (if selected)</label>
            <input type="number" step="0.1" name="customPoints" placeholder="e.g. 10" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>

          <div className="space-y-2 md:col-span-3">
            <label className="text-sm text-foreground">Description / Details</label>
            <input name="description" required placeholder="e.g. Fixed the login bug #42, or Built the Settings page" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button type="submit" className="glow bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">
              Submit & Award Points
            </button>
          </div>
        </form>
      </div>

      <div className="glass rounded-xl overflow-x-auto border border-border">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="p-4 text-sm font-medium text-muted-foreground w-1/4">Member</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Contribution</th>
              <th className="p-4 text-sm font-medium text-muted-foreground w-32 text-right">Points Added</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">No contributions logged yet.</td>
              </tr>
            ) : tasks.map(task => (
              <tr key={task.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  {task.assignee ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {task.assignee.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-foreground font-medium">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unknown</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{task.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                </td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    +{task.pointHistory?.[0]?.points?.toFixed(1) || '0.0'} pts
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
