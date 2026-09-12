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
    if (!result) return isSelected ? 'bg-[#d9eee9] border-[#0f766e]' : 'bg-[#fffdf8] border-[#d8dfd8]'

    const isCorrectChoice = choiceIndex === result.correctIndex
    if (isCorrectChoice) return 'bg-[#e5f3e7] border-[#9bc8a3]'
    if (isSelected && !isCorrectChoice) return 'bg-[#fae2dc] border-[#e5a69b]'
    return 'bg-[#fffdf8] border-[#d8dfd8]'
  }

  return (
    <div className="rounded-[2px] border border-[#d8dfd8] bg-[#fffdf8] p-5 shadow-sm mb-4">
      <div className="mb-3 font-semibold text-[#18312f]">
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
