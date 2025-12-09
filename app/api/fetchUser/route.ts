import prisma from '@/app/components/singletons/client';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')!

    var fetchedUser

    try {
        fetchedUser = await prisma.user.findFirstOrThrow({
            where: { email: email },
            include: { quizzes: true }
        });
    }
    catch (error) {
        fetchedUser = { id: null }
    }

    return NextResponse.json(fetchedUser)
}