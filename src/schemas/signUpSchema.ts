import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,'Username must be of Two characters')
    .max(20,'Username must not be more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/,'Username must not Contain Special Character') 

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid Email Address'}),
    password: z.string().min(8,'Password must be of length 8')
})