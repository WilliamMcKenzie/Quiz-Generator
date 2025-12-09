"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import QuizzesHeader from "../components/quiz/quizzes_header";
import QuizzesDisplay from "../components/quiz/quizzes_display";

export default function Quiz() {
  const { data: session } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState()
  const [user_data, setUserData] = useState()

  useEffect(() => {
    if(session) init()
    else router.push("/")
  }, [])

  async function init()
  {
    const user_data = await (await fetch(`/api/fetchUser?email=${session.user.email}`)).json()
    setQuizzes(user_data.quizzes.reverse())
    setUserData(user_data)
  }

  return (
    <div style={{overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh"}} className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font`}>
      <QuizzesHeader/>
      {
        quizzes ?
        <QuizzesDisplay quizzes={quizzes} user_data={user_data}/>
        :
        <></>
      }
    </div>);
}