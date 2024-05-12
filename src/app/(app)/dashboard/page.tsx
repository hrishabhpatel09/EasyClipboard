'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import Navbar from '@/components/Navbar'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'
import { Loader2, RefreshCcw } from 'lucide-react'
import { Message } from '@/model/User.model'

function page() {
  const {data: session} = useSession();
  const user: User = session?.user as User
  const [messages, setMessages ] = useState<Message[]>([])
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((message)=>message._id !== message))
  }
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  });
  const {register, handleSubmit, watch, setValue} = form

  const acceptMessages = watch('acceptMessages')
  
  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true)
    console.log('hi')
    try {
      const response = await axios.get('/api/accept-messages');
      console.log('fetching accept message api')
      console.log(response)
      setValue('acceptMessages',response.data.isAcceptingMessages);
      console.log(response.data.isAcceptingMessages)
    } catch (error:any) {
      toast({
        title: 'Axios Error',
        description: error?.response?.data.message,
      })
    }
    finally{
      setIsSwitchLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get('/api/get-messages');
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title: 'Refreshed messages',
          description: 'Showing the latest Results'
        })
      }
    } catch (error:any) {
      toast({
        title: 'Error fetching Message',
        description: error
      })
    }
    finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading, setMessages])

  useEffect(()=>{
    if(!session || !session.user) return 

    fetchMessages();
    fetchAcceptMessage();
  },[acceptMessages])

  //handle switch change

  const handleSwitchChange = async() =>{
    try {
      const response = await axios.post('/api/accept-messages',{acceptMessages: !acceptMessages})
      console.log(response.data.isAcceptingMessages)
      setValue('acceptMessages',!acceptMessages)
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Axios Error',
        description: 'Failed to change accept message status',
        variant: 'destructive'
      })
    }
    finally{
      setIsSwitchLoading(false)
    }
  }
  
  if(!session || !session.user){
    return (
      <div>
        Please Login
      </div>
    )
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };
  return (
    <>
      <Navbar/>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default page
