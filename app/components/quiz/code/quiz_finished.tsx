import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Background from "../../animated_background"
import { useState } from "react"

interface props_typing {
  user_email : string,
  quiz_length : number,
  quiz_ranking : any,
  quiz_code : string,
  is_leaderboard : boolean
}

export default function FinishScreen({ user_email, quiz_length, quiz_ranking, quiz_code, is_leaderboard } : props_typing) {
  const router = useRouter()
  const transition = {
    duration: 1,
    delay: 1,
    ease: [0, 0.71, 0.2, 1.01]
  }

  const [loading, initiateLoading] = useState<boolean>(false)

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
      <motion.div style={{ height: "100vh" }} className="flex flex-col justify-center"
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}>
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
                      <th style={{color: "transparent"}}> LORUMIPSUM </th>
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
      </motion.div>
      <Background/>
    </div>
  )
}