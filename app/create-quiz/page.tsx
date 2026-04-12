'use client'
import { log } from 'console'
import { useState, useEffect } from 'react'

export default function NewExam() {
 const [numOfQues, setNumOfQues] = useState(5)
  const [config,setConfig] = useState({ title: '', durationMinutes: 10, startTime: '', endTime: '' ,totalMarks: 100,marksPerQues: 20,password: ''})
  const [questions, setQuestions] = useState(() => Array.from({ length: numOfQues }).map((_, i) => ({ text: `Question ${i + 1}`, serial: i + 1, choices: [{ text: 'Option A', isCorrect: i === 0 }, { text: 'Option B' }, { text: 'Option C' }, { text: 'Option D' }] })))
  const userId="1234";
  useEffect(() => {
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

  async function handleCreate(e: any) {
    e.preventDefault()
    
    const quizData={
      userId,
      config,
      questions,
    }
    // console.log(quizData.questions.flat());
    // message:"created"
    const res = await fetch('/api/exams', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(quizData) })
    const data = await res.json()
    if (res.ok) {
      message: 'created'
      // setJoinCode(data.joinCode)
    } else {
      alert(data.error || 'Failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-500">
      <header className="bg-gray-800 shadow p-4">Create Quiz</header>
      <main className="p-6 bg-amber-300">
        <div className="max-w-4xl mx-auto bg-gray-700 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Quiz Builder</h2>
          <form onSubmit={handleCreate} className="space-y-1">
            {/* custom config */}
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300 w-40">Duration (Minutes)</label>
                <input value={config.durationMinutes} type='number' onChange={e => {
                  const v = e.target.value
                  const n = v === '' ? 0 : parseInt(v, 10) || 0
                  setConfig({...config, durationMinutes: n})
                }} className="flex-1 border p-2 rounded" />
                </div>
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300 w-40">Marks Per Question </label>
                <input value={config.marksPerQues} type='number' onChange={e => {
                  const v = e.target.value
                  const n = v === '' ? 0 : parseInt(v, 10) || 0
                  setConfig({...config, marksPerQues: n})
                }} className="flex-1 border p-2 rounded" />
                </div>
                <div className='flex flex-wrap gap-4'>
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300 w-40">Duration (Minutes)</label>
                <input value={config.durationMinutes} type='number' onChange={e => setConfig({...config, durationMinutes: parseInt(e.target.value)})} className="flex-1 border p-2 rounded" required={true}/>
                </div>
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300 w-40">Marks Per Question </label>
                <input value={config.marksPerQues} type='number' onChange={e => setConfig({...config, marksPerQues: parseInt(e.target.value)})} className="flex-1 border p-2 rounded" required={true}/>
                </div>
               
                <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300 w-40">Start Time</label>
                <input value={config.startTime} type='date' onChange={e => setConfig({...config, startTime: e.target.value})} className="flex-1 border p-2 rounded" required={true}/>
                </div>
                <div className="flex items-center gap-2 ml-16">
                <label className="text-sm font-medium text-gray-300 w-40">End Time</label>
                <input value={config.endTime} type='date' onChange={e => setConfig({...config, endTime: e.target.value})} className="flex-1 border p-2  rounded" required={true}/>
                </div>
                </div>
                <div className="space-y-2">
                {/* questions */}
              {questions.map((q, qi) => (
                <div key={qi} className="p-3 border rounded  bg-gray-600">
                    <div className="flex  flex-row items-center">
                <p className='text-white'>{ q.serial}.</p>
                  <input placeholder={q.text} value={q.text} onChange={e => { const copy = [...questions]; copy[qi].text = e.target.value; setQuestions(copy) }} className="w-full m-2 border p-2 rounded" required={true}/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {q.choices.map((c: any, ci: number) => (
                      <div key={ci} className="flex gap-2 items-center">
                        <input type="radio" name={`correct-${qi}`} checked={!!c.isCorrect} onChange={() => { const copy = [...questions]; copy[qi].choices.forEach((cc: any) => cc.isCorrect = false); copy[qi].choices[ci].isCorrect = true; setQuestions(copy) }} required={true}/>
                        <input placeholder={c.text} value={c.text} onChange={e => { const copy = [...questions]; copy[qi].choices[ci].text = e.target.value; setQuestions(copy) }} className="flex-1 border p-1 rounded" required={true}/>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
              <button onClick={()=>{setNumOfQues(prev=>prev+1)}} className="px-4 py-2 bg-yellow-600 text-white rounded">Add +1</button>
              <button onClick={()=>{setNumOfQues(prev=>prev+5)}} className="px-4 py-2 bg-yellow-600 text-white rounded">Add +5</button>
              <button onClick={()=>{setNumOfQues(prev=>prev-1)}} className="px-4 py-2 bg-red-600 text-white rounded">Remove -1</button>
              {joinCode && <div className="p-2 bg-gray-100 rounded">Join Code: <strong>{joinCode}</strong></div>}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
