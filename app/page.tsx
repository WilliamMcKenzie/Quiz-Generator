"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from "react"
import { signIn, useSession } from "next-auth/react"

export default function Home() {
    const { data: session } = useSession()
    const router = useRouter()

  return (
    <button onClick={() => signIn('google')}>
CLICK
    </button>
  )
}