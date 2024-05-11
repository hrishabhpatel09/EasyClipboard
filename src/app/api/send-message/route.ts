import apiResponse from "@/helper/apiResponse";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    await connectDB();

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username: username});
        if(!user){
            return NextResponse.json(new apiResponse(
                'Invalid username',
                false,
                204
            ))
        }
        if(!user.isAcceptingMessage){
            return NextResponse.json(new apiResponse(
                'user is not accepting messages Currently',
                false,
                403
            ))
        }
        const newMessage = {
            content: content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save();
        return NextResponse.json(new apiResponse(
            'Message Send Successfully',
            true,
            200
        ))
    } catch (error) {
        return NextResponse.json(new apiResponse(
            'Failed to send Messages',
            false,
            500
        ))
    }
}
