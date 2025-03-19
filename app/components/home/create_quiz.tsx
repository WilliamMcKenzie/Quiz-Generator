import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface props_typing {
    session : any,
    code_ref : any
}

export default function CreateQuiz({ session, code_ref } : props_typing)
{
    const router = useRouter()
    const [subject, setSubject] = useState<string>("")
    const [progress, setProgress] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const max_progress = 6000
    const transition = {
        duration: 0.5,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01]
    }

    useEffect(() => window.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && session) {
            createQuiz()
        }
    }), [])

    async function uploadQuiz(raw_quiz: string) 
    {
        const quiz = JSON.parse(raw_quiz)
        if (quiz.quiz_name == "INVALID_INPUTS")
        {
            setLoading(false)
            setProgress(0)
            setSubject("")
            setError(true)
        }
        else
        {
            const quiz_code = await (await fetch(`/api/uploadQuiz?content=${JSON.stringify(quiz.content)}&name=${quiz.quiz_name}`, { method: "POST" })).text()
            router.push("/quiz/" + quiz_code)
        }
    }

    async function createQuiz() 
    {
        if (session && subject.length < 100) 
        {
            var generatedQuiz = ""
            var temp_progress = 0
            setLoading(true)

            await fetch(`/api/generateQuiz?prompt=${subject}`).then(res => {
                const reader = res.body?.getReader()
                reader?.read().then(function pump({done, value}) : any {
                    if (done) 
                    {
                        setProgress(max_progress)
                        return uploadQuiz(generatedQuiz.replace(/\n/g, ""))
                    }

                    const string_val = String.fromCharCode.apply(null, Array.from(value))
                    generatedQuiz += string_val
                    temp_progress += string_val.length
                    setProgress(temp_progress)

                    return reader.read().then(pump);
                })
            })
        }
        else
        {
            setSubject("")
            setError(true)
        }
    }

    return (
        <>
            <div className="absolute top-10 right-10">
                <button disabled={loading} className="btn btn-ghost mr-2" onClick={() => code_ref?.current.showModal()}>
                    Enter code
                </button>
                <button disabled={loading} className="btn btn-ghost" onClick={() => { router.push(`/quiz`) }}>
                    Your quizzes
                </button>
            </div>
            <motion.div className="flex flex-col"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transition}>
                
                <div className="flex justify-center items-center mt-6">
                    <label className={"input input-bordered flex items-center gap-2" + (error ? " input-error text-error" : "")}>
                        <input
                            value={subject}
                            type="text" 
                            spellCheck="false"
                            list="autocompleteOff" 
                            autoComplete="off"
                            aria-autocomplete="none"
                            onChange={(e) => {
                                setSubject(e.target.value)
                                setError(false)
                            }}
                            placeholder={error ? "Invalid subject" : "Enter a subject"}
                            disabled={loading}
                        />
                        <button onClick={() => createQuiz()} disabled={false}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 opacity-70">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </label>
                </div>
                <div className="flex justify-center items-center mt-6 h-1">
                    {loading && progress == 0 ? <span className="loading loading-dots text-primary loading-lg"></span> : <></>}
                    {loading && progress > 0 ? <progress className="progress progress-primary w-100" value={progress} max={max_progress}></progress> : <></>}
                </div>
            </motion.div>
        </>
    )
}