import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User.model";

export async function POST(request:NextRequest) {
    const {otp} = await request.json();
    if(!otp){
        return NextResponse.json({
            message: 'Please enter your verification code',
            success: false
        })
    }
    const user = await UserModel.findOne({verifyCode: otp});
    if(!user){
        return NextResponse.json({
            message: 'Invalid Otp'
        })
    }
    const currentTime = new Date();
    const isOtpValid = user.verifyCodeExpiry>=currentTime;
    if(!isOtpValid){
        return NextResponse.json({
            message: 'Otp is expired. retry Signup'
        })
    }
    else{
        user.isVerified = true;
        await user.save()
        return NextResponse.json({
            message: 'Otp verification Successfull'
        },{status: 200})
    }
}