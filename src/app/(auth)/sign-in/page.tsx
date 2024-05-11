'use client'
import { useToast } from '@/components/ui/use-toast'
import React, { useState } from 'react'
import { signInSchema } from '@/schemas/loginSchema'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {z} from 'zod'


function page() {
  const {toast} = useToast()
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async() =>{
    const data: z.infer<typeof signInSchema>={
      identifier: username,
      password: password
    } 
    const result = await signIn('credentials',{
        redirect:false,
        identifier: data.identifier,
        password: data.password
    })
    console.log(result)   
    if(result?.error){
        toast({
            title: 'Login Failed',
            description: 'Incorrect Credential',
            variant: 'destructive'
        })
    }

    if(result?.url){
        router.replace('/dashboard')
    }
  }
  return (
    <div className='flex'> 
      Username: <input type="text" placeholder='username' name='username' onChange={(e)=>setUsername(e.target.value)}/>
      <hr />
      Password: <input type="text" placeholder='password' name='password' onChange={(e)=>setPassword(e.target.value)}/>
      <button className='bg-black text-white p-2 rounded-md' onClick={onSubmit}>Login</button>
    </div>
  )
}

export default page
