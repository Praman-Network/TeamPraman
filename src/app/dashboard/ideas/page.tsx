import React from 'react'
import { db } from '@/lib/db'
import { submitIdea } from './actions'

export default async function IdeasPage() {
  const ideas = await db.idea.findMany({
    include: {
      author: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const allUsers = await db.user.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold glow-text">Ideas & Features</h1>
          <p className="text-muted-foreground mt-1">Track who contributed what idea (+2 points per idea).</p>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary glow-text">Log a New Idea</h3>
        <form action={submitIdea} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-foreground">Idea Title</label>
            <input name="title" required placeholder="New dashboard layout" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-foreground">Idea by (Author)</label>
            <select name="authorId" required className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none">
              <option value="">Select member...</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-3">
            <label className="text-sm text-foreground">Idea Description</label>
            <textarea name="description" required placeholder="Detailed explanation of the idea..." rows={3} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none custom-scrollbar" />
          </div>

          <div className="md:col-span-4 flex items-center justify-between mt-2 pt-4 border-t border-border/50">
            <div className="text-sm text-primary font-medium flex items-center gap-2">
              <span className="flex h-6 w-6 rounded-full bg-primary/20 items-center justify-center">✨</span>
              This will automatically award +2 Points to the author.
            </div>
            <button type="submit" className="glow bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">
              Submit Idea
            </button>
          </div>
        </form>
      </div>

      <div className="glass rounded-xl overflow-x-auto border border-border">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="p-4 text-sm font-medium text-muted-foreground">Idea</th>
              <th className="p-4 text-sm font-medium text-muted-foreground w-1/4">Author</th>
              <th className="p-4 text-sm font-medium text-muted-foreground w-32 text-right">Points Added</th>
            </tr>
          </thead>
          <tbody>
            {ideas.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">No ideas logged yet.</td>
              </tr>
            ) : ideas.map(idea => (
              <tr key={idea.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-foreground">{idea.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{idea.description}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {idea.author.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-foreground font-medium">{idea.author.name}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    +2.0 pts
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
