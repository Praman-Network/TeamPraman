'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createMeeting(formData: FormData) {
  const title = formData.get('title') as string
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const description = formData.get('description') as string
  
  // Combine date and time into a single Date object
  const startDateTime = new Date(`${dateStr}T${timeStr}`)
  const endDateTime = new Date(startDateTime)
  endDateTime.setHours(endDateTime.getHours() + 1) // default 1 hour meeting

  await db.meeting.create({
    data: {
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
    }
  })

  revalidatePath('/dashboard/meetings')
}

export async function markAttendance(meetingId: string, attendeeIds: string[]) {
  // First, find all users to verify they are active
  const users = await db.user.findMany({
    where: {
      id: { in: attendeeIds }
    }
  })

  for (const user of users) {
    // 1. Create MeetingMember record (ignore if already exists to prevent duplicate points)
    const existing = await db.meetingMember.findUnique({
      where: {
        meetingId_userId: { meetingId, userId: user.id }
      }
    })

    if (!existing) {
      await db.meetingMember.create({
        data: {
          meetingId,
          userId: user.id,
          attended: true
        }
      })

      // 2. Award Points (+1) for attending
      await db.pointHistory.create({
        data: {
          userId: user.id,
          points: 1.0,
          reason: 'Attended Team Meeting',
          sourceType: 'MEETING',
          sourceId: meetingId,
        }
      })
    }
  }

  revalidatePath('/dashboard/meetings')
}
