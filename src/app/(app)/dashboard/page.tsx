'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'


function page() {
    const {data: session} = useSession();
    const user: User = session?.user as User


  return (
    <div>
      Hello {session?.user.username}, Thanks For using Mystery Message
    </div>
  )
}

export default page
