import { useRouter } from "next/navigation"
import { forwardRef, LegacyRef, useState } from "react"

export default forwardRef(function EnterCode({}, ref : LegacyRef<HTMLDialogElement>)
{
    const router = useRouter()
    const [quiz_code, setQuizCode] = useState("")
    const [fetch_state, setFetchState] = useState(0)

    async function submit()
    {
        setFetchState(1)
        const quiz = await (await fetch(`/api/fetchQuiz?quiz_code=${quiz_code}`)).json()

        if (quiz) router.push(`/quiz/${quiz_code}`)
        else 
        {
            setFetchState(2)
            setQuizCode("")
        }
    }

    return (
        <dialog ref={ref} id="share_modal" className="modal">
            <div className="modal-box" style={{maxWidth: "fit-content"}}>
                <div>
                    <label className="label mb-4">
                        <span className="text-base label-text">Enter a code</span>
                    </label>
                    <label className={"input input-ghost flex items-center gap-2" + (fetch_state == 2 ? " input-error text-error" : "")}>
                        <input
                            value={quiz_code}
                            type="text" 
                            spellCheck="false"
                            list="autocompleteOff" 
                            autoComplete="off"
                            aria-autocomplete="none"
                            onChange={(e) => {
                                    if (fetch_state == 2) setFetchState(0)
                                    setQuizCode(e.target.value.toUpperCase())
                                }
                            }
                            placeholder={fetch_state == 2 ? "Invalid code" : "XXXXXX"}
                        />
                        <button onClick={() => submit()} disabled={fetch_state == 1}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 opacity-70">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </label>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-primary" onClick={() => {
                            setQuizCode("")
                            setFetchState(0)
                        }}>
                            Close
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    )
})