import { useState } from "react"

interface props_typing {
    quiz_step_data : any,
    step_score : number,
    question_index : number,
    setScore : any,
    setQuestion : any,
    finish : any
}

export default function QuestionInterface({ quiz_step_data, step_score, question_index, setScore, setQuestion, finish } : props_typing)
{
    const [guess_index, setGuess] = useState<number | null>(null)
    const [answer_locked_in, LockInAnswer] = useState<boolean>(false)
    const [quiz_finished, FinishQuiz] = useState<boolean>(false)

    const step_title: string = quiz_step_data.name
    const current_question: any = quiz_step_data.questions[question_index]

    return (
        <div className="flex flex-col items-center justify-center" style={{ width: "100vw", height: "100vh" }}>
            <h1 style={{fontSize:'2rem'}} className="main_font font-bold"> {step_title.toUpperCase()} </h1>
            <p style={{marginBottom:'100px', marginTop:'10px'}} className="main_font"> {current_question.question} </p>
            <div className="flex flex-col items-center justify-center">
                {current_question.responses.map((response : string, index : number) => {
                    var button_class = ""
                    const guessed_index = index == guess_index
                    const correct_index = current_question.correct_index == index

                    if (answer_locked_in && correct_index && (guess_index != null))
                    {
                        button_class = "btn-success"
                    }
                    else if (answer_locked_in && guessed_index)
                    {
                        button_class = "btn-error"
                    }
                    else if (guessed_index)
                    {
                       button_class = "btn-secondary"
                    }

                    return (
                        <button disabled={quiz_finished || (answer_locked_in && (!guessed_index && !correct_index))} className={ "btn relative h-12 w-full mt-2 " + button_class } style={{ width: "50vw", maxWidth: "40rem" }} key={index} onClick={() => { setGuess(index) }}>
                            <a className="absolute left-4">{index + 1}</a>
                            {response}
                        </button>
                    )
                })}

                {
                    answer_locked_in ? 
                    <button 
                        className="btn btn-secondary w-full mt-6" 
                        style={{ maxWidth: "30rem" }}
                        disabled={quiz_finished}
                        onClick={() => {
                            setGuess(null)
                            if (quiz_step_data.questions.length > question_index + 1)
                            {
                                setQuestion(question_index + 1)
                                LockInAnswer(false)
                            }
                            else
                            {
                                FinishQuiz(true)
                                finish()
                            }
                        }
                    }>
                        CONTINUE
                    </button>
                    :
                    <button
                        disabled={guess_index == null}
                        className="btn btn-primary w-full mt-6"
                        style={{ maxWidth: "30rem" }}
                        onClick={() => {
                            if (guess_index === current_question.correct_index) setScore(step_score + 1)
                            LockInAnswer(true)
                        }
                    }>
                        CHECK
                    </button>
                }
            </div>
        </div>
    )
}