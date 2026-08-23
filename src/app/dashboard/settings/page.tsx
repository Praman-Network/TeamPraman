import React from 'react'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/SettingsForm'

export const revalidate = 0

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('mock_user_role')?.value === 'founder'
  
  if (!isAdmin) {
    redirect('/dashboard')
  }

  // Fetch the founder (Admin user)
  const adminEmail = process.env.ADMIN_EMAIL
  let founder = null
  
  if (adminEmail) {
    founder = await db.user.findUnique({
      where: { email: adminEmail }
    })
  }

  if (!founder && adminEmail) {
    // Create the founder if not found
    let role = await db.role.findUnique({ where: { name: 'Founding Member' } })
    if (!role) {
      role = await db.role.create({ data: { name: 'Founding Member' } })
    }
    founder = await db.user.create({
      data: {
        name: 'Rahul Chaudhary',
        email: adminEmail,
        department: 'Founder',
        roles: {
          create: {
            roleId: role.id
          }
        }
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage global configurations and your founder profile.</p>
      </div>
      
      <div className="glass p-8 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Founder Profile</h2>
        {founder ? (
          <SettingsForm user={founder} />
        ) : (
          <p className="text-muted-foreground">No founding member found in the database.</p>
        )}
      </div>
    </div>
  )
}
