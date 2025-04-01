import prisma from '@/app/components/singletons/client'
import { groq } from '@ai-sdk/groq'
import { jsonSchema, streamObject } from 'ai'
import { getServerSession } from 'next-auth'

const quiz_schema = jsonSchema({
  type: 'object',
  properties: {
    quiz_name: { type: 'string' },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                responses: {
                  type: 'array',
                  items: { type: 'string' },
                },
                correct_index: { type: 'integer' },
              },
              required: ['question', 'responses', 'correct_index'],
            },
          },
        },
        required: ['name', 'questions'],
      },
    },
  },
  required: ['quiz_name', 'content'],
})

export async function GET(req) {
  const session = await getServerSession()
  
  if (session)
  {
    const ai_request = `Generate JSON for a quiz based on the user-provided subject, number of questions per step (MAX 5), and steps (MAX 5). If a step is an empty string you choose the subject of the step, with the step name reflecting the subject. Never have the correct_index be the same for 2 questions in a row. If the user's subject is nonsensical return { "content" : [], "quiz_name" : "INVALID_INPUTS"}. Include no other text/comments aside from the JSON.`
    const ai_models = [
      "gemma2-9b-it",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "llama-3.3-70b-versatile",
    ]
    
    const searchParams = req.nextUrl.searchParams
    const prompt = searchParams.get('prompt')

    const user_data = await prisma.user.findFirst({ where: { email: session.user.email } })
    var ai_model = 0
    var questions = 3
    var steps = ["", "", ""]

    const current_time = Math.floor(Date.now() / 1000)
    if (!user_data.pro && current_time - user_data.last_generated < 30)
    {
      return new Response(JSON.stringify({ "content" : [], "quiz_name" : 'TOO_SOON'}))
    }
    else
    {
      await prisma.user.update({ where: { email: session.user.email }, data: { last_generated: current_time } })
    }

    if (user_data.pro)
    {
      ai_model = parseInt(searchParams.get('ai_model')) || 0
      questions = parseInt(searchParams.get('questions')) || 3
      steps = JSON.parse(searchParams.get('steps')) ?? ["", "", ""]

      if (ai_model == 3 && current_time - user_data.last_generated_advanced < 180)
      {
        // return new Response(JSON.stringify({ "content" : [], "quiz_name" : 'TOO_SOON_ADVANCED'}))
      }
      else if (ai_model == 3)
      {
        await prisma.user.update({ where: { email: session.user.email }, data: { last_generated_advanced: current_time } })
      }
    }

    const result = streamObject({
        model: groq(ai_models[ai_model]),
        system: ai_request,
        schema: quiz_schema,
        prompt: `subject: ${prompt}, steps: ${JSON.stringify(steps)} (${steps.length} total steps), # of questions per step: ${questions}`,
    })

    return (await result).toTextStreamResponse()
  }

  return new Response(JSON.stringify({ "content" : [], "quiz_name" : 'INVALID_INPUTS'}))
}