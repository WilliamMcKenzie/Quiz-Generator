import prisma from '@/app/components/singletons/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const quiz_code = searchParams.get('quiz_code')!
    const fetchedQuiz = await prisma.quiz.findFirst({ where: { code: quiz_code } })

    return NextResponse.json(fetchedQuiz)
}