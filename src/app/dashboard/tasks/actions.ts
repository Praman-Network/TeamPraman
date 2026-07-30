'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function logContribution(formData: FormData) {
  const assigneeId = formData.get('assigneeId') as string
  const contributionType = formData.get('contributionType') as string
  const description = formData.get('description') as string

  // Determine points based on type
  let points = 0
  let title = ''

  switch (contributionType) {
    case 'UI_UX':
      points = 5.0
      title = 'Complete UI/UX Built'
      break
    case 'PR_MERGED':
      points = 3.0
      title = 'PR Merged Successfully'
      break
    case 'IMPLEMENTATION_PLAN':
      points = 3.0
      title = 'Implementation Plan Created'
      break
    case 'ISSUE_RAISED':
      points = 2.0
      title = 'Issue Raised'
      break
    case 'PART_BUILT':
      points = 1.5
      title = 'Part / Component Built'
      break
    case 'CUSTOM':
      points = parseFloat(formData.get('customPoints') as string) || 0
      title = 'Custom Contribution'
      break
    default:
      points = 0
      title = 'Unknown Contribution'
  }

  // Save the record as a completed task so it appears in the tracker
  const task = await db.task.create({
    data: {
      title,
      description,
      status: 'DONE',
      assigneeId,
    }
  })

  // Award the points
  if (points > 0) {
    await db.pointHistory.create({
      data: {
        userId: assigneeId,
        points,
        reason: `${title}: ${description}`,
        sourceType: 'TASK',
        sourceId: task.id,
        taskId: task.id,
      }
    })
  }

  revalidatePath('/dashboard/tasks')
}
