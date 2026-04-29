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
    if (!result) return isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white'

    const isCorrectChoice = choiceIndex === result.correctIndex
    if (isCorrectChoice) return 'bg-green-50 border-green-300'
    if (isSelected && !isCorrectChoice) return 'bg-red-50 border-red-300'
    return 'bg-white'
  }

  return (
    <div className="p-4 border rounded mb-3 bg-white">
      <div className="mb-2 font-medium text-black">
        {question?.index}. {question?.text}
      </div>
      <div className="grid gap-2">
        {(question?.choices || []).map((c, idx) => (
          <button
            key={`${question?._id || 'q'}:${idx}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(idx)}
            className={`text-left p-3 rounded border text-black disabled:opacity-60 ${getChoiceClass(idx)}`}
          >
            {c?.text}
          </button>
        ))}
      </div>
    </div>
  )
}
