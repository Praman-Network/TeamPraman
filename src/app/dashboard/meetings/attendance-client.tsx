'use client'

import React, { useState } from 'react'
import { markAttendance } from './actions'

type User = {
  id: string
  name: string
}

type Attendee = {
  userId: string
}

export function AttendanceClient({ 
  meetingId, 
  allUsers, 
  currentAttendees 
}: { 
  meetingId: string
  allUsers: User[]
  currentAttendees: Attendee[]
}) {
  // Extract user IDs that already attended
  const attendedSet = new Set(currentAttendees.map(a => a.userId))
  
  // State for newly checked users
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleUser = (userId: string) => {
    const next = new Set(selectedIds)
    if (next.has(userId)) {
      next.delete(userId)
    } else {
      next.add(userId)
    }
    setSelectedIds(next)
  }

  const handleSubmit = async () => {
    if (selectedIds.size === 0) return
    setIsSubmitting(true)
    try {
      await markAttendance(meetingId, Array.from(selectedIds))
      setSelectedIds(new Set()) // clear selection after success
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {allUsers.map(user => {
          const hasAttended = attendedSet.has(user.id)
          return (
            <label 
              key={user.id} 
              className={`flex items-center space-x-2 text-sm p-2 rounded-lg border ${hasAttended ? 'bg-primary/10 border-primary/30 cursor-not-allowed opacity-70' : 'bg-input/50 border-border cursor-pointer hover:bg-input'}`}
            >
              <input 
                type="checkbox" 
                disabled={hasAttended || isSubmitting}
                checked={hasAttended || selectedIds.has(user.id)}
                onChange={() => toggleUser(user.id)}
                className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4 disabled:opacity-50"
              />
              <span className={hasAttended ? 'text-primary font-medium' : 'text-foreground'}>
                {user.name} {hasAttended && '(Attended)'}
              </span>
            </label>
          )
        })}
      </div>

      {selectedIds.size > 0 && (
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full text-xs font-medium glow bg-primary text-primary-foreground py-2 rounded-lg transition-all"
        >
          {isSubmitting ? 'Marking...' : `Submit Attendance for ${selectedIds.size} Member(s)`}
        </button>
      )}
    </div>
  )
}
