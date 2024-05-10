import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";


export const sendEmail = async(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>=>{
    try {
        const response = await resend.emails.send(
            {
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: 'Mystery Message Verification Code',
                react: VerificationEmail({username, otp: verifyCode}),
              }
        )
        return {success:true, message: 'Verification Email Send Successfully'}
    } catch (error) {
        console.error('Error sending verification email',error)
        return {success:false, message: 'Failed to send Verification Email'}
    }
}