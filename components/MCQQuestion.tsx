import { useState } from 'react'

export default function MCQQuestion({
  question,
  selected,
  onSelect,
  result,
}: {
  question: any
  selected?: string | null
  onSelect?: (choiceId: string) => void
  result?: { correct: boolean; correctChoiceId?: string } | null
}) {
  const [local, setLocal] = useState<string | null>(selected || null)

  function handleClick(id: string) {
    setLocal(id)
    onSelect && onSelect(id)
  }

  return (
    <div className="p-4 border rounded mb-3">
      <div className="mb-2 font-medium">{question?.index}.  {" "}{question?.text }</div>
      <div className="grid gap-2">
        {(question?.choices || []).map((c: any) => {
          let extra = 'bg-white'
          if (result && result.correctChoiceId) {
            if (c.id === result.correctChoiceId) extra = 'bg-yellow-100'
            if (local === c.id && result.correct) extra = 'bg-green-100'
            if (local === c.id && !result.correct && c.id !== result.correctChoiceId) extra = 'bg-red-100'
          } else {
            if (local === c.id) extra = 'bg-blue-500'
          }
          return (
            <button key={c.id} onClick={() => handleClick(c.id)} className={`text-left p-3 text-taupe-950 rounded border ${extra}`}>
              {c.text || 'Image choice'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
