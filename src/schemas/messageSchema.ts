import {z} from 'zod'

const MessageSchema = z.object({
    content: z
    .string()
    .min(2,'Content is too short')
})

export default MessageSchema