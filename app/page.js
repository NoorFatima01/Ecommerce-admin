'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {

    const { data: session, status } = useSession();
    if(!session)   return (
      <main  className='bg-blue-900 w-screen h-screen flex items-center'>
      <div className="text-center w-full">
      <button className="bg-white p-4 rounded-lg" onClick={() => signIn('google')}>Login With Google</button>
      </div>
      </main>
    )

  return (
    <main  className='bg-blue-900 w-screen h-screen flex items-center'>
  <div>Logged In {session.user.email}</div>
    </main>
  )
}
