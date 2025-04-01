import { GitHub, Google, Microsoft } from "@mui/icons-material";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function SignIn()
{
    const transition = {
        duration: 0.5,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01]
    }
    return (
        <motion.div className="flex flex-col"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={ transition }>
            <button onClick={() => signIn('google')} className="btn btn-primary mt-16">
                Sign in with Google
                <Google></Google>
            </button>
        </motion.div>
    )
}