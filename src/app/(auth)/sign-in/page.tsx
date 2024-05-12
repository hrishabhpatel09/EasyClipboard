'use client'
import { useToast } from '@/components/ui/use-toast'
import React, { useEffect, useState } from 'react'
import { signInSchema } from '@/schemas/loginSchema'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {z} from 'zod'
import Link from 'next/link'

function Page() {
  const {toast} = useToast()
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisable, setIsButtonDisabled] = useState(true)
  const [processing,setProcessing] = useState(false)

  const onSubmit = async() =>{
    setProcessing(true);
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
    setProcessing(false)
  }

  useEffect(()=>{
    if(username.length>0 && password.length>0){
      setIsButtonDisabled(false)
    }
    else{
      setIsButtonDisabled(true)
    }
  },[username, password])
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md items-center flex flex-col">
          <h4 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-6 text-center">Dive into the world of Mystery Message</h4>
              <input type="text" placeholder='username' name='username' onChange={(e)=>setUsername(e.target.value)} className="border-black border-b-2 h-9 w-[260px] p-1 mb-4"/>
              <input type="text" placeholder='password' name='password' onChange={(e)=>setPassword(e.target.value)} className="border-black border-b-2 h-9 w-[260px] p-1 mb-4"/>
              <p>{processing?"Wait for a minute, Processing ...": ""}</p>
              <button className='bg-black text-white p-2 rounded-md' onClick={onSubmit} disabled={isButtonDisable}>Login</button>
              <div>
                  <p>Doesn&#39;t Have an Account?</p>
                  <p className="font-bold text-blue-500 text-center"><Link href={'/sign-up'}>Register</Link></p>
              </div>
        </div>
      </div>
    </>
    
  )
}

export default Page
