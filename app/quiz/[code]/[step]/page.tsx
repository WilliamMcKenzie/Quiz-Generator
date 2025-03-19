"use client"
import QuestionInterface from "@/app/components/quiz/code/step/quiz_questions"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Step({ params } : any) {
  const router = useRouter()
  const quiz_code = params.code
  const quiz_step = params.step

  const [quiz_step_data, setStep] = useState<Record<string, string | number>>({})
  const [question_index, setQuestion] = useState<number>(0)
  const [step_score, setScore] = useState<number>(0)

  useEffect(() => { init() }, [])

  async function init()
  {
    const fetched_quiz: Record<string, Array<Record<string, string | number>>> = await (await fetch(`/api/fetchQuiz?quiz_code=${quiz_code}`)).json()
    setStep(fetched_quiz.content[quiz_step])
  }

  async function finish()
  {
    await fetch(`/api/updateQuiz?quiz_code=${quiz_code}&correct_questions=${step_score}&step=${quiz_step}`, { "method" : "POST" })
    router.push(`/quiz/${quiz_code}`)
  }

  return (
    <div className="flex items-center justify-center" style={{ width: "100vw", height: "100vh" }}>
      {
        "questions" in quiz_step_data ? (
            <QuestionInterface 
              quiz_step_data={quiz_step_data} 
              step_score={step_score} 
              question_index={question_index} 
              setScore={setScore} 
              setQuestion={setQuestion}
              finish={finish}
            />
        ) : <></>
      }
    </div>
  )
}