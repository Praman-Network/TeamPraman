'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addMember(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const department = formData.get('department') as string
  const joiningDateStr = formData.get('joiningDate') as string
  const expectedEndDateStr = formData.get('expectedEndDate') as string
  const roleNames = formData.getAll('roles') as string[]

  const joiningDate = new Date(joiningDateStr)
  
  let expectedEndDate: Date | null = null
  if (expectedEndDateStr) {
    expectedEndDate = new Date(expectedEndDateStr)
  } else {
    expectedEndDate = new Date(joiningDate)
    expectedEndDate.setFullYear(expectedEndDate.getFullYear() + 1) // default 1 year
  }

  // Create the User
  const user = await db.user.create({
    data: {
      name,
      email,
      department,
      joiningDate,
      expectedEndDate,
      status: 'ACTIVE',
    },
  })

  // Assign multiple roles
  for (const roleName of roleNames) {
    let role = await db.role.findUnique({
      where: { name: roleName },
    })

    if (!role) {
      role = await db.role.create({
        data: { name: roleName },
      })
    }

    await db.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    })

    // Award points if Founding Member
    if (roleName === 'Founding Member') {
      await db.pointHistory.create({
        data: {
          userId: user.id,
          points: 100, // Updated to 100
          reason: 'Selected as Founding Member'
        }
      })
    }
  }

  revalidatePath('/dashboard/members')
}
