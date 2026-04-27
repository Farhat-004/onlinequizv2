"use client"
import MCQQuestion from "@/components/MCQQuestion";


export default  function Quiz() {
  return (
    <section>
        <h2 className="text-center pt-3">Quiz Name</h2>
        <div className="mt-6">
          <MCQQuestion question={{
            index:1,
            text: "What is the capital of France?",
            choices: [
              { id: "1", text: "Berlin" },
              { id: "2", text: "Madrid" },
              { id: "3", text: "Paris" },
              { id: "4", text: "Rome" },
            ]
          }} />
        </div>
    </section>
  )
}
