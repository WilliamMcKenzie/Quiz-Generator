import { deepseek } from '@ai-sdk/deepseek'
import { openai } from '@ai-sdk/openai'
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth';
 
export async function GET(req) {
  const session = await getServerSession()
  
  if (session)
  {
    const aiRequest = `Generate a valid JSON for a quiz based on the user-provided subject. Format: {content:[{name: '', questions: [{question: '', responses: '', correct_index: 0}]}], quiz_name:''}. Content is an array of 3-5 step objects, each step with name (the step's title) and questions, an array with 4-8 question objects. Each question has question (the prompt), responses (2-5 answer options, one correct at a random index), and correct_index. Steps should reflect a learning progression. If user input is nonsensical return { "content" : [], "quiz_name" : "INVALID_INPUTS"}. Include no other text/comments aside from the JSON.`
    const searchParams = req.nextUrl.searchParams
    const prompt = searchParams.get('prompt')
    
    const result = streamText({
        model: groq("llama3-8b-8192"),
        system: aiRequest,
        prompt: prompt,
    })

    return (await result).toTextStreamResponse()
  }

  return new Response(JSON.stringify({ "content" : [], "quiz_name" : 'INVALID_INPUTS'}))
}