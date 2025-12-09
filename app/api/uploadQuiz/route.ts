import prisma from '@/app/components/singletons/client'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const session = await getServerSession()
    
    if (session)
    {
        const searchParams = request.nextUrl.searchParams
        const content = JSON.parse(searchParams.get('content')!)
        const quiz_name = searchParams.get('name')!

        const quiz = await prisma.quiz.create({
            data: {
                name: quiz_name,
                code: generateCode(),
                ranking: {},
                content: content,
            }
        });

        await prisma.user.update({
            where: {
                name: session!.user!.name!,
                email: session!.user!.email!,
            },
            data: {
                quizzes: {
                    connect: {
                        id: quiz.id,
                    },
                },
            },
        })
        return new Response(quiz.code)
    }
    return new Response()
}

function generateCode() {
    var sample = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var result = ""

    for (var i = 0; i < 5; i++) {
        if (Math.random() * 10 > 7)
        {
            result += sample[Math.floor(Math.random()*26)]
        }
        else
        {
            result += (1 + Math.floor(Math.random()*9)).toString()
        }
    }
    return result
}
