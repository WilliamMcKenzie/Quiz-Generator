import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const auth_options: NextAuthOptions = {
    providers : [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks : {
        async signIn({ user })
        {
            const fetched_user = await prisma.user.findFirst({ where: { email: user.email! } })

            if (!fetched_user)
            {
                await prisma.user.create({
                    data: {
                        email: user.email!,
                        name: user.name!,
                        profile: {},
                        id: 1,
                    }
                }) 
            }

            return true
        }
    }
}

const handler = NextAuth(auth_options)
export { handler as GET, handler as POST }