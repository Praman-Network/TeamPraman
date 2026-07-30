'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function submitIdea(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const authorId = formData.get('authorId') as string
  
  // Create Idea with minimal required fields filled with defaults
  const idea = await db.idea.create({
    data: {
      title,
      description,
      problem: 'N/A', // Auto-filled to keep UI simple as requested
      solution: 'N/A',
      impact: 'N/A',
      priority: 'MEDIUM',
      status: 'APPROVED', // Assuming ideas logged here are approved
      authorId,
    }
  })

  // Award exactly 2 points for the idea as requested
  await db.pointHistory.create({
    data: {
      userId: authorId,
      points: 2.0,
      reason: `Submitted Idea: ${title}`,
      sourceType: 'IDEA',
      sourceId: idea.id,
    }
  })

  revalidatePath('/dashboard/ideas')
}
