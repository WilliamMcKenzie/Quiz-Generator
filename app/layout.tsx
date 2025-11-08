import { getServerSession } from "next-auth"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import SessionProvider from "./components/session"

import "./globals.css"

export const metadata: Metadata = {
  title: "Rizzchess",
  description: "Its time to rizz.",
}

export default async function RootLayout({ children } : Readonly<{ children: React.ReactNode }>) 
{
  const session = await getServerSession()
  
  return (
    <html lang="en">
      <body>
          <Analytics/>
          <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
