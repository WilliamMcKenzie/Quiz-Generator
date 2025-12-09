import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface prop_typing {
    quizzes : any,
    user_data : any
}

export default function QuizzesDisplay({ quizzes, user_data } : prop_typing)
{
    const router = useRouter()

    return (
    <div style={{ justifyContent: "center", overflowY: "scroll", marginTop: "5rem", width: "80vw", display: "grid", gridGap: "1rem", gridTemplateColumns: "repeat(auto-fit, 24rem)" }}>
        {quizzes.map((quiz : any, index : number) => {
            if ( !(quiz.code in user_data.quiz_details) ) return
            if ( index > 50 ) return

            const quiz_code = quiz.code
            const quiz_length = quiz.content.length
            const quiz_progress = user_data.quiz_details[quiz_code].step

            var class_name = "w-96 h-32 btn"
            var special_colors = ["btn-primary", "btn-secondary", "btn-accent"]

            if (quiz_progress == quiz_length)
            {
                class_name += " " + special_colors[index % 3] 
            }

            return (
                <div key={index} onClick={() => router.push("/quiz/" + quiz.code)} className={class_name}>
                    <div className="card-body items-center text-center">
                        <h2 className="card-title"> {quiz.name} </h2>
                        <p> Progress {quiz_progress}/{quiz_length} </p>
                    </div>
                </div>
            )
        })}
    </div>
    )
}