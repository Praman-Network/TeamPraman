'use server'

import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateMemberProfile(userId: string, formData: FormData) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('mock_user_role')?.value === 'founder'

  if (!isAdmin) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const department = formData.get('department') as string | null
  const avatarUrl = formData.get('avatarUrl') as string | null
  const linkedinUrl = formData.get('linkedinUrl') as string | null
  const githubUrl = formData.get('githubUrl') as string | null
  const discordHandle = formData.get('discordHandle') as string | null
  
  if (!name) {
    throw new Error('Name is required')
  }

  let finalAvatarUrl = avatarUrl
  
  // If no avatarUrl but githubUrl is provided, fetch github avatar
  if (!finalAvatarUrl && githubUrl) {
    try {
      const url = new URL(githubUrl)
      if (url.hostname === 'github.com') {
        const username = url.pathname.split('/').filter(Boolean)[0]
        if (username) {
          finalAvatarUrl = `https://github.com/${username}.png`
        }
      }
    } catch (e) {
      // Ignore invalid URL parsing errors
    }
  }

  await db.user.update({
    where: { id: userId },
    data: {
      name,
      department,
      avatarUrl: finalAvatarUrl,
      linkedinUrl,
      githubUrl,
      discordHandle,
    }
  })

  // Revalidate paths that show user info
  revalidatePath(`/members/${userId}`)
  revalidatePath('/')
  revalidatePath('/dashboard/leaderboard')
  
  return { success: true }
}
