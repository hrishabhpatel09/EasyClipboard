'use client'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  
import { redirect, useParams } from "next/navigation" 
import { MouseEventHandler, useEffect, useState } from "react"
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation'

function page() {
  const {toast} = useToast()
  const {username} = useParams()
  const [code, setCode]= useState('')
  const [isButtonActive, setIsButtonActive] = useState(false)
  const router = useRouter();


  const onSubmit = async()=>{
    try {
      const data = {
        username: username,
        code: code
      }
      const response = await axios.post('/api/verify',data);
      if(response.data.success){
        toast({
          title: response.data.message,
        })
        router.replace('/sign-in')
      }
    } catch (error:any) {
      toast({
        title:'Error validating Otp',
        description: error
      })
    }
  }

  useEffect(()=>{
    if(code.length==6){
      setIsButtonActive(true)
    }
    else{
      setIsButtonActive(false)
    }
  },[code])
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full flex flex-col max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md items-center justify-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Enter your Otp</h2>
          <InputOTP maxLength={6} value={code} onChange={(value:any)=>setCode(value)}>
              <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
              </InputOTPGroup>
                  <InputOTPSeparator />
              <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
              </InputOTPGroup>
          </InputOTP>
          <button className="mt-4 bg-black text-white pt-2 pb-2 pr-4 pl-4 text-center rounded-lg" onClick={onSubmit} disabled={!isButtonActive}>Verify</button>
      </div>
    </div>
  )
}

export default page
