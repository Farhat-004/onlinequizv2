"use server"
import { auth } from '@/auth'
import JoinExam from '@/components/JoinExam'
import LandingPage from '@/components/LandingPage'

export default async function Home() {
  const user = await auth()
  if (!user) return <LandingPage />
  return <JoinExam />
}
