type Choice = {
  text: string
}

type Question = {
  _id?: string
  index?: number
  text: string
  choices: Choice[]
}

export type QuestionResult = {
  correctIndex: number
  selectedIndex: number | null
}

export default function MCQQuestion({
  question,
  selectedIndex,
  onSelect,
  disabled,
  result,
}: {
  question: Question
  selectedIndex: number | null
  onSelect: (choiceIndex: number) => void
  disabled?: boolean
  result?: QuestionResult | null
}) {
  function getChoiceClass(choiceIndex: number) {
    const isSelected = selectedIndex === choiceIndex
    if (!result) return isSelected ? 'bg-green-500 border-green-200' : 'bg-white border-slate-200'

    const isCorrectChoice = choiceIndex === result.correctIndex
    if (isCorrectChoice) return 'bg-emerald-50 border-emerald-200'
    if (isSelected && !isCorrectChoice) return 'bg-red-50 border-red-200'
    return 'bg-white border-slate-200'
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
      <div className="mb-3 font-semibold text-slate-900">
        {question?.index}. {question?.text}
      </div>
      <div className="grid gap-2">
        {(question?.choices || []).map((c, idx) => (
          <button
            key={`${question?._id || 'q'}:${idx}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(idx)}
            className={`text-left p-3 rounded-2xl border text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:opacity-60 disabled:hover:translate-y-0 ${getChoiceClass(idx)}`}
          >
            {c?.text}
          </button>
        ))}
      </div>
    </div>
  )
}
