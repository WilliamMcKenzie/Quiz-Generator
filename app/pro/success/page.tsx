"use client"

import Background from "@/app/components/animated_background";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter()

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="absolute top-0 navbar bg-base-100 z-10 shadow-sm">
        <div className="navbar-start">
          <button className="btn btn-ghost" onClick={() => router.push("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-lg">
          Purchase successful!
        </p>
        <label className="font-semibold text-3xl">
          You are now a <a className="text-primary">PRO</a>
        </label>
        <button className="btn btn-primary mt-[2rem]" onClick={() => router.push("/")}>
          Continue
        </button>
      </div>
      <Background/>
    </div>
  )
}