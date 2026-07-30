'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Mock Login Check for Founder
  if (email === 'rahulchaudharyji2@gmail.com' && password === 'Rahul@123') {
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
