import prisma from '@/app/components/singletons/client'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const search_params = request.nextUrl.searchParams
    const session = await getServerSession()
    const email = session?.user?.email!

    const quiz_code = search_params.get("quiz_code")!

    const user = await prisma.user.findFirst({ 
        where: { email: email }
    })
    var quiz_details: any = user!.quiz_details
    delete quiz_details[quiz_code]


    const updated_user = await prisma.user.update({
        where: { email : email },
        data: { quiz_details: quiz_details }
    })

    const quiz : any = await prisma.quiz.findFirst({
        where : { code : quiz_code }
    })

    delete quiz.ranking[session?.user?.email!]

    await prisma.quiz.update({
        where: { code : quiz_code },
        data: { ranking : quiz.ranking }
    })

    return new Response(JSON.stringify(updated_user))
}