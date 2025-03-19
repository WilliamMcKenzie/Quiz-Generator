"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import Background from './components/animated_background'
import CreateQuiz from './components/home/create_quiz'
import SignIn from './components/home/sign_in'
import EnterCode from './components/home/enter_code'

export default function Home() {
    const { data: session } = useSession()
    const router = useRouter()

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "")
    const code_ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (searchParams.has("go") && session) router.push(`/quiz/${searchParams.get("go")}`)
    }, [])

  return (
    <div style={{ overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh" }} className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font`}>
        <h1 className="text-center mb-4 text-4xl font-bold" >QUIZ GEN</h1> 
        <h3 className="text-center mb-4 text-xl">Test your knowledge on anything.</h3>
        <Background/>
        <EnterCode ref={code_ref}/>
        
        { session ? <CreateQuiz session={session} code_ref={code_ref}/> :<SignIn/> }
    </div>
  );
}