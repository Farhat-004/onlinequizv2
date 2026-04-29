"use client"
import MCQQuestion from "@/components/MCQQuestion";
import { useSearchParams } from "next/navigation";
import { join } from "path";
import { useEffect, useState } from "react";


export default  function Quiz() {
  const searchParams=useSearchParams()
  const joinCode=searchParams.get("joinCode")
    const [questions,setQuestions]=useState([])
    useEffect(()=>{
        if(!joinCode) return
        // Fetch questions using join code
        async function fetchQuestions() {
          try {
            const response=await fetch(`/api/exams?joinCode=${encodeURIComponent(joinCode)}`)
            if(!response.ok) throw new Error("Failed to fetch questions")
            const data=await response.json()
            setQuestions(data.questions || [])
            console.log(data)
          } catch (error) {
            console.error(error.response?.data || error.message || "Failed to fetch questions");
          }
        }
        fetchQuestions()
    },[joinCode])
  return (
    <section>
        <h2 className="text-center pt-3">Quiz Name</h2>
        <div className="mt-6">
          {questions.map((q,index)=>(
            <MCQQuestion key={q?._id} question={{...q,index:index+1}} />
          ))}
       
        </div>
    </section>
  )
}
