"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import ShareModal from "@/app/components/quiz/code/quiz_share"
import Navbar from "@/app/components/navbar"
import FinishScreen from "@/app/components/quiz/code/quiz_finished"

export default function Quiz({ params }: { params: { code: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const quiz_code = params.code
  const share_ref = useRef<HTMLDialogElement>(null)
  
  const [content, setQuiz] = useState<Array<Record<string, string | number> | Array<string>>>([])
  const [quiz_name, setQuizName] = useState<string>("");
  const [quiz_ranking, setQuizRanking] = useState<Array<Record<string, number>>>([])

  useEffect(() => {
    if (session) init()
    else router.push("/")
  }, [])

  async function init(){
    const fetched_quiz = await (await fetch(`/api/fetchQuiz?quiz_code=${quiz_code}`)).json()
    
    if (!fetched_quiz) router.push("/")
    else 
    {
      setQuiz(fetched_quiz.content)
      setQuizName(fetched_quiz.name)
      setQuizRanking(fetched_quiz.ranking)
    }
  }

  return (
    <main className="flex justify-center items-center flex-col" style={{ width: "100vw", height: "100vh" }}>
      <Navbar title={quiz_name.toUpperCase()} quiz_code={quiz_code} options={{ "share_ref": share_ref }}/>
      <ShareModal ref={share_ref} quiz_code={quiz_code}/>
      <FinishScreen user_email={session?.user?.email!} quiz_length={content.length} quiz_ranking={quiz_ranking} quiz_code={quiz_code} is_leaderboard={true}/>
    </main>
  )
}