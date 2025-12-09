import { useRouter } from "next/navigation"
import Background from "../../animated_background"
import { useState } from "react"

interface props_typing {
  user_email : string,
  quiz_content : any
  quiz_ranking : any,
  quiz_code : string,
  is_leaderboard : boolean
}

export default function FinishScreen({ user_email, quiz_content, quiz_ranking, quiz_code, is_leaderboard } : props_typing) {
  const router = useRouter()
  const [loading, initiateLoading] = useState<boolean>(false)

  var quiz_length = 0
  for (var subject of quiz_content)
  {
    quiz_length += subject.questions.length
  }

  var quiz_ranking_array : any = []
  for (var key of Object.keys(quiz_ranking))
  {
    var _key : any = key
    quiz_ranking_array.push(quiz_ranking[_key])
  }

  quiz_ranking_array.sort((a : any, b : any) => {
      return b.score - a.score
  })

  async function restart()
  {
    initiateLoading(true)
    await fetch(`/api/restartQuiz?quiz_code=${quiz_code}`, { "method" : "POST" })
    window.location.reload()
  }

  return (
    <div>
      <div style={{ maxWidth: "80vw", zIndex: 1 }} className="card w-125 bg-base-100 shadow-sm p-2">
      <div style={{ maxHeight: "40vh" }} className="overflow-x-auto">
            <table className="table">
              <tbody>
                {
                  quiz_ranking_array.map(({ score, user } : { score : any, user: any }, index : number) => {
                    var email = user.email
                    var username = user.name

                    return (
                      <tr style={ email == user_email ? { color: "var(--color-primary)" } : {} } key={index}>
                        <th> { index == 0 ? "1st" : index == 1 ? "2nd" : (index+1).toString() + "rd" } </th>
                        <td> { username } </td>
                        <td> { score as number }/{ quiz_length } </td>
                      </tr>
                    )
                  })
                }
                {
                  Array.from({ length: Math.max(0, 6 - Object.keys(quiz_ranking).length) }).map((_, index) => (
                    <tr key={index}>
                      <th style={{color: "transparent"}}> 0 </th>
                      <td></td>
                      <td></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          {
            is_leaderboard ?
            <button className="btn btn-primary mt-5" onClick={() => { router.push(`/quiz/${quiz_code}`) }}> Back </button>
            :
            <button className="btn btn-primary mt-5" onClick={restart} disabled={loading}> Restart </button>
          }
      </div>
      <Background/>
    </div>
  )
}