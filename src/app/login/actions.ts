'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Check against environment variables
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set('mock_user_role', 'founder', { secure: true, path: '/' })
    redirect('/dashboard')
  }

  // If wrong credentials
  redirect('/login?error=Invalid credentials')
}

export async function signup(formData: FormData) {
  redirect('/login?error=Signup is disabled in mock mode')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('mock_user_role')
  redirect('/')
}
