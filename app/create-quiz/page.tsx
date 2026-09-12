'use client'
import Link from "next/link";
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
export default function NewExam() {
  type Choice = { text: string; isCorrect?: boolean }
  type Question = { text: string; serial: number; choices: Choice[] }
  const [created, setCreated] = useState(false)
  const [numOfQues, setNumOfQues] = useState(5)
  const [config,setConfig] = useState({ title: '', durationMinutes: 10, startTime: '', endTime: '' ,totalMarks: 100,marksPerQues: 20,password: ''})
  const [questions, setQuestions] = useState<Question[]>(() => Array.from({ length: numOfQues }).map((_, i) => ({ text: `Question ${i + 1}`, serial: i + 1, choices: [{ text: 'Option A', isCorrect: i === 0 }, { text: 'Option B' }, { text: 'Option C' }, { text: 'Option D' }] })))
  const session=useSession();
  
  const userId = (session?.data as unknown as { userId?: string | null } | null)?.userId ?? null
  const marksPerQuestion = Number.isFinite(config.marksPerQues) ? config.marksPerQues : 0
  const totalMarks = questions.length * marksPerQuestion
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep existing behavior; only UI changes intended
    setQuestions(prev => {
      const prevLen = prev.length
      if (numOfQues === prevLen) return prev
      if (numOfQues > prevLen) {
        const additions = Array.from({ length: numOfQues - prevLen }).map((_, i) => ({
          text: `Question ${prevLen + i + 1}`,
          serial: prevLen + i + 1,
          choices: [{ text: 'Option A' }, { text: 'Option B' }, { text: 'Option C' }, { text: 'Option D' }],
        }))
        return [...prev, ...additions]
      }
      // numOfQues < prevLen -> remove extra questions
      return prev.slice(0, Math.max(0, numOfQues))
    })
  }, [numOfQues])
  const [joinCode, setJoinCode] = useState<string | null>(null)
  const [createdPassword, setCreatedPassword] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const quizData={
      config: { ...config, totalMarks },
      questions,
    }
   
    const res = await fetch('/api/exams', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(quizData) })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setJoinCode(data.joinCode)
      setCreatedPassword(data.password ?? config.password)
      setCreated(true)
    } else {
      alert(data.message || "Failed to create quiz")
    }
  }
  const handleCopy = () => {
    if (joinCode) {
      const text = `Join Code: ${joinCode}${createdPassword ? `\nPassword: ${createdPassword}` : ""}`
      navigator.clipboard.writeText(text)
        .then(() => alert('Join code and password copied to clipboard!'))
        .catch(() => alert('Failed to copy. Please copy manually: ' + text));
    }
  };
  if(!userId){
    return (
      <div className="min-h-screen home-bg2 flex items-center justify-center p-6">
        <div className="glass-card p-6 text-center">
          <h1 className="text-xl font-bold text-black">Please sign in</h1>
          <Link href="/signin" className="btn-primary mt-4">
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen home-bg2">
      <header className="border-b border-[#d8dfd8] bg-[#fffdf8]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#d95f4f] uppercase">Teacher</div>
            <div className="text-xl font-bold text-[#18312f]">Create Quiz</div>
          </div>
          {joinCode ? (
            <div className="badge flex flex-wrap gap-2">
              <span>Join Code: <span className="font-mono text-black">{joinCode}</span></span>
              {createdPassword ? (
                <span>Password: <span className="font-mono text-black">{createdPassword}</span></span>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>
      <main className="p-6">
        <div className="max-w-4xl mx-auto glass-card border-t-4 border-t-[#d95f4f] p-6 home-bg2">
          <h2 className="text-lg font-semibold mb-4 text-[#18312f]">Quiz Builder</h2>
          <form onSubmit={handleCreate} className="space-y-1">
            {/* custom config */}
           <span className='gap-2 flex-col md:flex-row flex'>
             <label className="text-sm font-medium mt-1 text-black w-40">Quiz Tittle :</label>
                <input value={config.title} type='text' onChange={e => setConfig({...config, title: e.target.value})} className="input flex-1" required={true}/>
               
             <label className="text-sm font-medium mt-1 text-black w-40 ">Password :</label>
                <input value={config.password} type='text' onChange={e => setConfig({...config, password: e.target.value})} className="input flex-1 " required={true}/>
               
           </span>
                
                
                <div className='flex flex-wrap gap-4'>
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black w-40">Duration (Minutes):</label>
                <input value={config.durationMinutes} type='number' onChange={e => setConfig({...config, durationMinutes: parseInt(e.target.value)})} className="input flex-1" required={true}/>
                </div>
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black w-40 pl-5">Marks Per Question :</label>
                <input value={config.marksPerQues} type='number' onChange={e => setConfig({...config, marksPerQues: parseInt(e.target.value)})} className="input flex-1" required={true}/>
                </div>
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black w-40">Total Marks:</label>
                <input value={totalMarks} type='number' className="input flex-1" readOnly/>
                </div>
               
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black w-40">Start Time:</label>
                <input value={config.startTime} type='date' onChange={e => setConfig({...config, startTime: e.target.value})} className="input flex-1" required={true}/>
                </div>
                <div className="flex items-center gap-2 ">
                <label className="text-sm font-medium text-black w-40">End Time:</label>
                <input value={config.endTime} type='date' onChange={e => setConfig({...config, endTime: e.target.value})} className="input flex-1" required={true}/>
                </div>
                </div>
                <div className="space-y-2">
                {/* questions */}
              {questions.map((q, qi) => (
                <div key={qi} className="p-4 border border-[#cbd8d2] rounded-[2px] bg-[#fffdf8] shadow-sm">
                    <div className="flex  flex-row items-center">
                  <p className="text-black font-semibold">{ q.serial}.</p>
                  <input placeholder={q.text} value={q.text} onChange={e => { const copy = [...questions]; copy[qi].text = e.target.value; setQuestions(copy) }} className="input w-full m-2" required={true}/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {q.choices.map((c, ci: number) => (
                      <div key={ci} className="flex gap-2 items-center">
                        <input type="radio" name={`correct-${qi}`} checked={!!c.isCorrect} onChange={() => { const copy = [...questions]; copy[qi].choices.forEach((cc) => cc.isCorrect = false); copy[qi].choices[ci].isCorrect = true; setQuestions(copy) }} required={true}/>
                        <input placeholder={c.text} value={c.text} onChange={e => { const copy = [...questions]; copy[qi].choices[ci].text = e.target.value; setQuestions(copy) }} className="input flex-1 py-2" required={true}/>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {created?<><span className="text-green-800 font-semibold pl-5">Quiz Created Successfully! {"   "} <button type="button" onClick={handleCopy} className="btn-primary">Copy Join Code & Password : {joinCode}</button></span>
              <Link href="/" className="btn-outline">
                Return to Dashboard
              </Link>
              </>:
                (<>
              <button type="submit" className="btn-primary" disabled={created}>
                {created ? "Quiz Created!" : "Create Quiz"}
              </button>
              <button type="button" onClick={()=>{setNumOfQues(prev=>prev+1)}} className="btn-outline">Add +1</button>
              <button type="button" onClick={()=>{setNumOfQues(prev=>prev+5)}} className="btn-outline">Add +5</button>
              <button type="button" onClick={()=>{setNumOfQues(prev=>Math.max(1, prev-1))}} className="btn-danger">Remove -1</button>
              
              </>)} 
           
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
