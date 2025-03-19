import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface prop_typing {
    content : Array<Record<string, string | number> | Array<string>>,
    quiz_details : Record<string, number>,
    quiz_code : string
}

export default function SelectionScreen({ content, quiz_details, quiz_code } : prop_typing)
{
    const router = useRouter()
    return (
        <div className="absolute top-5 w-full h-full text-3xl flex justify-center items-center">
            <div className="flex flex-col items-center justify-center">
                {content?.map((step, index) => {
                    return (
                    <motion.div className={ "m-5" } key={ "step_" + index  } style={{ marginRight: [70, 0][index % 2], marginLeft: [0, 70][index % 2] }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                        }}>
                        <button onClick={index <= quiz_details["step"] ? () => router.push(`/quiz/${quiz_code}/${index}`) : () => {}} className={`btn btn-circle ${index > quiz_details["step"] ? "btn" : index == quiz_details["step"] ? "btn-primary" : "btn-secondary"}`}>
                            <div>
                                { index + 1 }
                            </div>
                        </button>
                    </motion.div>
                    )
                })}
            </div>
        </div>
    )
}