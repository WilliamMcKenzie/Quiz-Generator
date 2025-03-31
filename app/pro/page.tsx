"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import isMobile from '../components/singletons/is_mobile'

export default function Pro() {
  const router = useRouter()
  
  const colors = ["primary", "secondary", "accent"]
  const [color, setColor] = useState(colors[0])
  const text_options = ["teachers,", "learners,", "developers,"]
  const [dynamic_text, setText] = useState(text_options[0])
  const [is_mobile, setMobile] = useState<boolean>(false)

  useEffect(() => {
    typeDynamicText()
    setMobile(isMobile())
    window.addEventListener('resize', () => {
        setMobile(isMobile())
    })
  }, [])

  async function delay(ms : number)
  {
    return await new Promise(res => setTimeout(res, ms))
  }

  async function typeDynamicText(index = 0, new_text = dynamic_text)
  {
    const current_text = text_options[(index + 1) % 3]

    while (new_text != "")
    {
      new_text = new_text.slice(0, new_text.length - 1)
      setText(new_text)
      await delay(100)
    }

    while (new_text != current_text)
    {
      new_text = current_text.slice(0, new_text.length + 1)
      setText(new_text)
      await delay(100)
    }

    await delay(3000)
    return typeDynamicText(index + 1, new_text)
  }

  async function purchasePro()
  {
    const url : string = await (await fetch("/api/stripeCheckout", { "method" : "POST" })).text()
    router.push(url)
  }

  return (
    <div style={{ overflow: "scroll" }} className={`max-h-screen mx-auto absolute`}>
        <div className="absolute top-0 navbar bg-base-100 z-10">
          <div className="navbar-start">
            <button className="btn btn-ghost" onClick={() => router.push("/")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            </button>
          </div>
          <div className="navbar-center">
            {
              !is_mobile ? <>
                <a className="btn btn-ghost text-l" href={`/pro#pricing`}>Pricing</a>
                <a className="btn btn-ghost text-l" href={`/pro#questions`}>FAQ</a>
              </>
              : 
              <></>
            }
          </div>
          <div className="navbar-end">
            <button className={`btn btn-${color}`} onClick={() => purchasePro()}>
              Buy Pro
            </button>
          </div>
        </div>

        <main className='mt-[12rem] mb-[4rem] w-screen flex flex-col items-center align-center p-4'>
          <div className='w-[fit-content]] flex flex-col items-center'>
            <div className='text-center font-bold text-4xl/[normal]'>
              Helping <span className={`text-${color} border-b-5 border-dashed border-${color}/50 whitespace-nowrap duration-200`}>{dynamic_text}</span> <br></br> lightening fast.
            </div>
            <div className='text-md font-normal text-center mt-[2rem] w-[60%]'>
              Upgrade to pro to enhance your QuizzGen experience.
            </div>
          </div>

          <div className={`border-t-5 border-b-5 border-0 border border-dashed border-[var(--color-base-100)] mt-[8rem] bg-slate-200 w-screen flex flex-col items-center align-center p-[4rem]`}>

            <div id="pricing" className='bg-[var(--background)] flex items-center justify-center rounded-lg overflow-hidden w-96 shadow-sm'>
              <video className="rounded-box aspect-square w-full sm:w-[26rem] sm:-m-2" autoPlay={true} muted={true} loop={true} playsInline={true} controls={true} width="500" height="500"><source src="/quizgen_pro.mp4" type="video/mp4"/></video>
            </div>

            <div className={'mt-[2rem] flex' + (is_mobile ? " flex-col" : "")}>
              <div className="card w-96 bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">Regular</h2>
                    <span className="text-xl">Free</span>
                  </div>
                  <ul className="mt-6 flex flex-col gap-2 text-xs">
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>1 AI model</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Maximum of 3 sections per quiz</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Leaderboard</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Share with friends</span>
                    </li>
                    <li className="opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span className="line-through">Detailed AI models</span>
                    </li>
                    <li className="opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span className="line-through">Advanced settings</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={"card w-96 bg-base-100 shadow-sm" + (!is_mobile ? " ml-[2rem]" : " mt-[2rem]")}>
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">Pro</h2>
                    <span className="text-xl">$5 USD</span>
                  </div>
                  <ul className="mt-6 flex flex-col gap-2 text-xs">
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>More detailed AI models</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Removes cooldown from basic AI models*</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Maximum 5 sections per quiz (Up to 5 questions per section)</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>More customization features</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Lifetime support</span>
                    </li>
                    <li>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>All regular features</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <button className={`btn btn-${color} btn-block`} onClick={() => purchasePro()}>Buy</button>
                  </div>
                </div>
              </div>
            </div>
            <p className='mt-[2rem]'>
              *The highest detail AI model is subject to a 3 minute cooldown to prevent abuse, the others are all 0 cooldown.
            </p>
            <p className='mt-[2rem]'>
              *Use with care. You might end up being the person everyone asks for advice.
            </p>

          </div>

          <div className={'mt-[12rem] w-[80vw] flex justify-center ' + (is_mobile ? " flex-col" : "")}>
            <div className='text-2xl w-[50%] font-semibold'>
              <p id='questions' className={`text-lg text-${color} font-medium`}>FAQ</p>
              Frequently Asked Questions
            </div>
            <div className={is_mobile ? "mt-[2rem]" : ""}>
              <div className="collapse collapse-arrow bg-base-100 border border-base-300 w-[50%">
                <input type="radio" name="my-accordion-2" defaultChecked />
                <div className="collapse-title font-semibold">How can I get support?</div>
                <div className="collapse-content text-sm">If you have any questions or problems to report, shoot an email to williamqmkz@gmail.com. We will get back to you as soon as possible!</div>
              </div>
              <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title font-semibold">What does QuizzGen do?</div>
                <div className="collapse-content text-sm">It generates Duolingo-style quizzes about any given topic! You can use it to study and test yourself on any subject. It isn't just for testing yourself though, this step-by-step approach has been proven to work from companies like Duolingo to help you learn new things.</div>
              </div>
              <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title font-semibold">How can I add more questions per section?</div>
                <div className="collapse-content text-sm">You can change the question amount under the Quiz Sections header in the advanced settings. *Pro only</div>
              </div>
              <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title font-semibold">I want to use ___ AI model!</div>
                <div className="collapse-content text-sm">We just use Groq for the text generation, so if it is avaliable on there you can! https://console.groq.com/docs/models
                  <br/> If you see a model you want that is not in the dropdown, email me at williamqmkz@gmail.com and I will add it.
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}