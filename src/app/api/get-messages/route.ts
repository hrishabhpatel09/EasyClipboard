import { getServerSession } from "next-auth";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import apiResponse from "@/helper/apiResponse";
import mongoose from "mongoose";


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
    const stringId = user._id;
    //TODO: covert this to mongoose boject id as this is String type
    const userId =new mongoose.Types.ObjectId(stringId);
    try {
        const user = await UserModel.aggregate([
            {
              $match: {_id: userId}
            },
            {
              $unwind: '$messages'
            },
            {
                $sort: {'messages.createdAt': -1}
            },
            {
                $group: {_id: '$_id', messages: {$push: '$messages'}}
            }
        ])
        if(user.length ===0){
            return NextResponse.json(new apiResponse(
                'No messages Found',
                false,
                204
            ))
        }
        return NextResponse.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return NextResponse.json(new apiResponse(
            'Error getting the messages',
            false,
            500
        ))
    }
}