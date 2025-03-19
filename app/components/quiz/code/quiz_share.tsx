import { forwardRef, LegacyRef } from "react"

interface prop_typing {
    quiz_code : string
}

export default forwardRef(function ShareModal({ quiz_code } : prop_typing, ref : LegacyRef<HTMLDialogElement>)
{
    const path = typeof window != undefined ? window.location.hostname + "/quiz/" + quiz_code : ""

    return (
        <dialog ref={ref} id="share_modal" className="modal">
            <div className="modal-box" style={{maxWidth: "fit-content"}}>
                <div className="stats">
                    <div className="stat">
                        <div className="stat-figure">
                            <button className="btn btn-circle btn-ghost text-secondary" onClick={() => { navigator.clipboard.writeText(quiz_code)} }>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /> </svg>
                            </button>
                        </div>
                        <div className="text-2xl font-bold">{quiz_code}</div>
                        <div className="stat-desc">Enter code at home screen</div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure">
                            <button className="btn btn-circle btn-ghost text-accent" onClick={() => {navigator.clipboard.writeText(path)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /> </svg>
                            </button>
                        </div>
                        <div className="font-bold text-xl">{path}</div>
                        <div className="stat-desc">Paste into your search bar</div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-primary">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
})