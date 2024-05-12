import { getServerSession } from "next-auth";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import apiResponse from "@/helper/apiResponse";

export async function POST(request: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return NextResponse.json(new apiResponse(
            'User not authenticated',
            false,
            401
        ))
    }
    const id = user._id;
    const {acceptMessages } = await request.json();
    console.log(acceptMessages)
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id,{
            isAcceptingMessage: acceptMessages
        },{new: true});
        if(!updatedUser){
            return NextResponse.json(new apiResponse(
                'Error Changing the status',
                false,
                401
            ))
        }
        else{
            return NextResponse.json(updatedUser)
        }
    } catch (error) {
        return NextResponse.json(new apiResponse(
            'Error Changing the status',
            false,
            401
        ))
    }
}

export async function GET(request:NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return NextResponse.json(new apiResponse(
            'User not authenticated',
            false,
            401
        ))
    }
    const id = user._id;
    try {
        const foundUser = await UserModel.findById(id);
        if(!foundUser){
            return NextResponse.json(new apiResponse(
                'User not found in the database',
                false,
                400
            ))
        }else{
            return NextResponse.json({
                isAcceptingMessages: foundUser.isAcceptingMessage,
                success: true
            },{status: 200})
        }
    } catch (error) {
        return NextResponse.json(new apiResponse(
            'Failed to get Current status of isAcceptingMessages',
            false,
            400
        ))
    }
}