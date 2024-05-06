import {z} from 'zod'

export const VerifySchema = z.object({
    code: z.string().length(6,'verification code must be of 6')
})