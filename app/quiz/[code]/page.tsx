"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import SelectionScreen from "@/app/components/quiz/code/quiz_selection"
import ShareModal from "@/app/components/quiz/code/quiz_share"
import Navbar from "@/app/components/navbar"
import FinishScreen from "@/app/components/quiz/code/quiz_finished"

export default function Quiz({ params } : any) {
  const { data: session } = useSession()
  const router = useRouter()
  const quiz_code = params.code
  const share_ref = useRef<HTMLDialogElement>(null)
  
  const [content, setQuiz] = useState<Array<Record<string, string | number> | Array<string>>>([])
  const [quiz_name, setQuizName] = useState<string>("");
  const [quiz_details, setQuizDetails] = useState<Record<string, number>>({})
  const [quiz_ranking, setQuizRanking] = useState<Record<string, number>>({})

  useEffect(() => {
    if (session) init()
    else router.push("/?go=" + quiz_code)
  }, [])

  async function init(){
    const fetched_quiz = await (await fetch(`/api/fetchQuiz?quiz_code=${quiz_code}`)).json()
    const fetched_user = await (await fetch(`/api/fetchUser?email=${session?.user?.email}`)).json()
    const quiz_details = fetched_user.quiz_details
    
    if (!fetched_quiz) router.push("/")
    else 
    {
      setQuiz(fetched_quiz.content)
      setQuizName(fetched_quiz.name)
      setQuizRanking(fetched_quiz.ranking)

      if (quiz_code in quiz_details) setQuizDetails(quiz_details[quiz_code])
      else 
      {
        await fetch(`/api/updateQuiz?quiz_code=${quiz_code}&correct_questions=0&step=-1`, { "method" : "POST" })
        setQuizDetails({ "correct_questions" : 0, "step" : 0 })
      }
    }
  }

  return (
    <main className="flex justify-center items-center flex-col" style={{ width: "100vw", height: "100vh" }}>
      <Navbar title={quiz_name.toUpperCase()} quiz_code={quiz_code} options={{ "share_ref": share_ref }}/>
      <ShareModal ref={share_ref} quiz_code={quiz_code}/>

      {
        quiz_details.step == content.length ?
        <FinishScreen user_email={session?.user?.email!} quiz_length={content.length} quiz_ranking={quiz_ranking} quiz_code={quiz_code} is_leaderboard={false}/>
        :
        <SelectionScreen content={content} quiz_details={quiz_details} quiz_code={quiz_code}/>
      }
    </main>
  )
}