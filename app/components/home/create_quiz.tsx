import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { LegacyRef, useEffect, useRef, useState } from "react"
import AdvancedSettings from "./advanced_settings"
import Navbar from "../navbar"
import isMobile from "../singletons/is_mobile"

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
    const [warning, setWarning] = useState<string>("")
    const [proPopup, showProPopup] = useState<boolean>(false)
    const [is_mobile, setMobile] = useState<boolean>(false)

    const advanced_settings_ref : LegacyRef<HTMLDialogElement> = useRef(null)

    const max_progress = 6000
    const transition = {
        duration: 0.5,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01]
    }

    useEffect(() => {
        setMobile(isMobile())
        window.addEventListener('resize', () => {
            setMobile(isMobile())
        })
        window.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && session) {
                createQuiz()
            }
        })
    }, [])

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
        else if (quiz.quiz_name == "TOO_SOON")
        {
            setLoading(false)
            setProgress(0)
            setSubject("")
            setWarning("Not so fast! You are on cooldown.")
        }
        else if (quiz.quiz_name == "TOO_SOON_ADVANCED")
        {
            setLoading(false)
            setProgress(0)
            setSubject("")
            setWarning("Not so fast! You already generated a quiz using Lama3 in the last 3 minutes.")
        }
        else
        {
            const quiz_code = await (await fetch(`/api/uploadQuiz?content=${JSON.stringify(quiz.content)}&name=${quiz.quiz_name}`, { method: "POST" })).text()
            router.push("/quiz/" + quiz_code)
        }
    }

    async function createQuiz(settings : Record<string, string> | null = null) 
    {
        if (session && subject.length < 100)
        {
            var generatedQuiz = ""
            var temp_progress = 0
            setLoading(true)

            var settings_string = ""
            if (settings)
            {
                settings_string = `&quiz_title=${settings.quiz_title}&ai_model=${settings.ai_model}&steps=${JSON.stringify(settings.steps)}&questions=${settings.questions}`
            }

            await fetch(`/api/generateQuiz?prompt=${settings ? settings.quiz_title : subject}${settings_string}`).then(res => {
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
        <div style={{ width: "100vw" }}>
            <AdvancedSettings ref={advanced_settings_ref} createQuiz={createQuiz} showProPopup={showProPopup}/>

            {
                warning != "" ?
                is_mobile ?
                    <div role="alert" className="alert sm:alert-horizontal absolute top-[5rem] left-[1rem] z-1" style={{ width: "calc(100vw - 2rem)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{warning}</span>
                        <div>
                            <button className="btn btn-accent btn-sm" onClick={() => setWarning("")}>Close</button>
                        </div>
                    </div>
                    :
                    <div role="alert" className="alert sm:alert-horizontal absolute top-2 left-2 z-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{warning}</span>
                        <div>
                            <button className="btn btn-accent btn-sm" onClick={() => setWarning("")}>Close</button>
                        </div>
                    </div>
                :
                <></>
            }

            {
                proPopup && warning == "" ?
                is_mobile ?
                    <div role="alert" className="alert sm:alert-horizontal absolute top-[5rem] left-[1rem] z-1" style={{ width: "calc(100vw - 2rem)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>To use the settings feature you need to be pro. Just type in the box below and hit the arrow!</span>
                        <div>
                            <button className="btn btn-primary btn-sm mr-2" onClick={() => router.push("/pro")}>Upgrade</button>
                            <button className="btn btn-accent btn-sm" onClick={() => showProPopup(false)}>Close</button>
                        </div>
                    </div>
                    :
                    <div role="alert" className="alert sm:alert-horizontal absolute top-2 left-2 z-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>To use the settings feature you need to be pro. Just type in the box below and hit generate!</span>
                        <div>
                            <button className="btn btn-primary btn-sm mr-2" onClick={() => router.push("/pro")}>Upgrade</button>
                            <button className="btn btn-accent btn-sm" onClick={() => showProPopup(false)}>Close</button>
                        </div>
                    </div>
                :
                <></>
            }

            {
                is_mobile ?
                <div className="absolute top-0 navbar bg-base-100 shadow-sm z-10">
                    <div className="navbar-start">
                    </div>
                    <div className="navbar-center">
                    </div>
                    <div className="navbar-end">
                        <button disabled={loading} className="btn btn-ghost mr-2" onClick={() => code_ref?.current.showModal()}>
                            Enter code
                        </button>
                        <button disabled={loading} className="btn btn-ghost" onClick={() => { router.push(`/quiz`) }}>
                            Your quizzes
                        </button>
                    </div>
                </div>
                :
                <div className="absolute top-10 right-10">
                    <button disabled={loading} className="btn mr-2" onClick={() => code_ref?.current.showModal()}>
                        Enter code
                    </button>
                    <button disabled={loading} className="btn" onClick={() => { router.push(`/quiz`) }}>
                        Your quizzes
                    </button>
                </div>
            }
            
            <motion.div className="flex flex-col justify-center items-center w-full"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transition}>
                
                <div className="flex flex-col justify-center items-center mt-6 w-[fit-content]">
                    <label style={{ maxWidth: "80vw" }} className="flex items-center gap-2">
                        <input className={"input input-bordered" + (error ? " input-error text-error" : "")}
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
                        <button className="btn btn-secondary" onClick={() => advanced_settings_ref?.current?.showModal()} disabled={loading}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 opacity-70">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                        <button className="btn btn-primary" onClick={() => createQuiz()} disabled={loading}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </button>
                    </label>
                    {loading && progress == 0 ? <span className="mt-4 loading loading-dots text-primary loading-lg"></span> : <></>}
                    {loading && progress > 0 ? <progress style={{ maxWidth: "80vw" }} className="mt-4 progress progress-primary w-[100%]" value={progress} max={max_progress}></progress> : <></>}
                </div>
            </motion.div>
        </div>
    )
}