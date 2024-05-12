import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Message } from "@/model/User.model"
import axios from 'axios'
import { useToast } from "./ui/use-toast"
type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}
  
function MessageCard({message, onMessageDelete}:MessageCardProps) {
    const {toast} = useToast()
    const handleDeleteConfirm = async() =>{
        const response  = await axios.delete(`/api/delete-message/${message._id}`)
        if(response.data.success){
          toast({title: response.data.message})
        }else{
          toast({title: response.data.message,color: '#FF0000',duration:2000})
        }
        onMessageDelete(message._id)
    }
    const localdate = message.createdAt;
    const dateInDateFormat = new Date(localdate)
    return (
      <Card>
        <CardHeader>
            <CardTitle>
                {message.content}
            </CardTitle>
            <CardDescription>
              {dateInDateFormat.toLocaleString()}
            </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive">Delete Message</Button>
                    </AlertDialogTrigger>
                        <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

        </CardFooter>
      </Card>
    )
  }
  
  export default MessageCard
  