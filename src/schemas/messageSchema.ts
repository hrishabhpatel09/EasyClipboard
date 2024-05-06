import {z} from 'zod'

export const MessageSchema = z.object({
    content: z
    .string()
    .min(2,'Content is too short')
})