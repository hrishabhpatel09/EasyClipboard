import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import connectDB from "@/lib/dbConnect";
import { VerifySchema } from "@/schemas/verifySchema";
import apiResponse from "@/helper/apiResponse";

export async function POST(request:NextRequest) {
    await connectDB();
    try {
        const {username, code} = await request.json()
        console.log(username,code)
        const decodedUsername  = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername});
        if(!user){
            return NextResponse.json(new apiResponse(
                'User Not found',
                false,
                400
            ))
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) >= new Date();

        if(isCodeNotExpired&&isCodeValid){
            user.isVerified =  true;
            await user.save()
            return NextResponse.json(new apiResponse(
                'User Verification successfull',
                true,
                200
            ))
        }
        else{
            return NextResponse.json(new apiResponse(
                'Otp Expired or Incorrect',
                false,
                204
            ))
        }

    } catch (error:any) {
        return NextResponse.json(new apiResponse(
            'Error Verifying User'+error,
            false,
            500
        ))
    }
}