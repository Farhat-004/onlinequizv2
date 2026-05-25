"use server"
import { auth } from '@/auth'
import JoinExam from '@/components/JoinExam'
import LandingPage from '@/components/LandingPage.jsx'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await auth()
  console.log("User in Home page:", user)
  if (!user) return <LandingPage />
  if(user.role === 'teacher') {
    return redirect('/dashboard')
  }
  return <JoinExam />
}
