"use client"
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { set } from 'mongoose'

function page() {
    const {username} = useParams()
    const {toast} = useToast()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const checkCurrentStatus = async() =>{
        setLoading(true)
        try {
            const response = await axios.post('/api/check-status',{username: username})
            if(response.data.isAcceptingMessages){
                sendMessageHandler()
            }else{
                toast({
                    title:'Failed to send Message',
                    description: 'User is not accepting Messages',
                    variant: 'destructive'
                })
                setLoading(false)
            }
        } catch (error) {
            toast({
                title: 'Axios error',
                description: 'Server is down'
            })
        }
        finally{
            setLoading(false)
        }
    }
    const sendMessageHandler = async() => {
        try {
            const response = await axios.post('/api/send-message',{username: username, content: content});
            toast({
                title: 'Message Send Successfully',
                description: response.data.message
            })
        } catch (error) {
            toast({
                title: 'Failed to send Message',
                description: 'Axios Error',
                variant: 'destructive'
            })
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <div className='w-full h-full flex justify-center'>
        <div className='h-[50vh] bg-gray-100 w-[70%] rounded-lg mt-4 shadow-md flex flex-col gap-2'>
            <h2 className='text-center text-pretty text-4xl font-extrabold font-sans'>Public link for anonymous Message</h2>
            <div className='pr-50 pl-20 mt-6'>
                <p className='text-left mb-2'>Sending Anonymous Message to @{username}</p>
                <textarea cols="30" rows="6" className='rounded-md' placeholder='Type Your Message here.' value={content} onChange={(e)=>setContent(e.target.value)}></textarea>
            </div>
            <p className='text-center'>{loading?'Please wait! sending message ...':''}</p>
            <button className='text-white bg-black rounded-md pt-2 pb-2 p-4 w-24 self-center justify-center mt-3' onClick={checkCurrentStatus}>Send</button>
        </div>
    </div>
  )
}

export default page
