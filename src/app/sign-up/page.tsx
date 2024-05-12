"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios from 'axios'
import { set } from "mongoose"
import { register } from "module"

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting]= useState(false);
    const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 300);
    const {toast} = useToast();
    const router = useRouter();
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    //zod implementation
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });
useEffect(()=>{

      const checkUniqueness = async () => {
          if(debouncedUsername){
            setIsCheckingUsername(true);
            setUsernameMessage('');
            try {
              const response = await axios.get(`api/unique-username?username=${debouncedUsername}`)
              if(response){
                setUsernameMessage(response.data.message);
              }
            } catch (error) {
              setUsernameMessage('Error Checking username')
            }
            finally{
              setIsCheckingUsername(false)
            }
          }
      } 
      checkUniqueness();
},[debouncedUsername])


  const onSubmit = async(data:any) =>{
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/signup',data);
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace(`/verify-code/${username}`)
      setIsSubmitting(false)
    } catch (error:any) {
      console.log('Error in signup')
      toast({
        title: 'Registration Failed',
        description: error
      })
      setIsSubmitting(false)
    }
  }
  const register = form.register
  const handleSubmit = form.handleSubmit
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join True Feedback
              </h1>
              <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <form>
                  <div className="text-center">
                    <input {...register('username')} className="border-black border-b-2 h-9 w-[260px] p-1 mb-4" onChange={(e)=>setUsername(e.target.value)} placeholder="Username" value={username}></input>
                    <p className="text-center pt-[0.5px]">{isCheckingUsername?'Loading...':usernameMessage}</p>
                    <input {...register('email')} className="border-black border-b-2 h-9 w-[260px] p-1 mb-4" onChange={(e)=>setEmail(e.target.value)} placeholder="email" value={email}></input>
                    <input {...register('password')} className="border-black border-b-2 h-9 w-[260px] p-1 mb-12" onChange={(e)=>setPassword(e.target.value)} placeholder="password" value={password}></input>
                    <hr />
                    <p>{isSubmitting?'Processing':''}</p>
                    <button className="mt-4 bg-black text-white pt-2 pb-2 pr-4 pl-4 text-center rounded-lg mb-3" onClick={handleSubmit(onSubmit)}>Signup</button>
                    <div>
                      <p>Already Have a Account?</p>
                      <p className="font-bold text-blue-500"><Link href={'/sign-in'}>Login</Link></p>
                    </div>
                  </div>
          </form>
      </div>
    </div>
  )
}

export default SignUpPage
