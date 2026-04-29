"use server"
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import JoinExam from '@/components/JoinExam'

export default async function Home() {
  const user = await auth()
  if(!user) redirect("/signin")
  return (
    <JoinExam />
  )
}