"use server"
import { auth } from '@/auth'
import JoinExam from '@/components/JoinExam'
import LandingPage from '@/components/LandingPage.jsx'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await auth()
  if (!user) return <LandingPage />
  if((user as { role?: unknown }).role === 'teacher') {
    return redirect('/dashboard')
  }
  return <JoinExam />
}
