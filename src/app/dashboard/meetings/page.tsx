import React from 'react'
import { db } from '@/lib/db'
import { createMeeting } from './actions'
import { AttendanceClient } from './attendance-client'

export default async function MeetingsPage() {
  const meetings = await db.meeting.findMany({
    include: {
      attendees: {
        include: { user: true }
      }
    },
    orderBy: { startTime: 'desc' }
  })

  const allUsers = await db.user.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold glow-text">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule meets and track team attendance.</p>
        </div>
      </div>

      <div className="glass p-6 rounded-xl overflow-x-auto border border-border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary glow-text">Schedule Meeting</h3>
        <form action={createMeeting} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-foreground">Title</label>
            <input name="title" required placeholder="Weekly Sync" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">Date</label>
            <input name="date" type="date" required className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">Time</label>
            <input name="time" type="time" required className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">Description (Optional)</label>
            <input name="description" placeholder="Discussing new features" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none" />
          </div>
          <button type="submit" className="glow bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium md:col-span-4 mt-2">
            Create Meeting
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meetings.length === 0 ? (
          <div className="lg:col-span-2 glass rounded-xl p-8 text-center text-muted-foreground">
            No meetings found. Schedule one above!
          </div>
        ) : (
          meetings.map(meeting => (
            <div key={meeting.id} className="glass rounded-xl p-6 border border-border space-y-4">
              <div className="border-b border-border/50 pb-4">
                <h3 className="text-xl font-bold text-foreground">{meeting.title}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(meeting.startTime).toLocaleString()}
                </div>
                {meeting.description && (
                  <p className="text-sm mt-2 text-foreground/80">{meeting.description}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-primary mb-3">Attendance</h4>
                <AttendanceClient 
                  meetingId={meeting.id} 
                  allUsers={allUsers} 
                  currentAttendees={meeting.attendees} 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
