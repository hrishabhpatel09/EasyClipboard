import { getServerSession } from "next-auth";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import apiResponse from "@/helper/apiResponse";

export async function DELETE(request:NextRequest, {params}:{params: {messageid: string}}) {
    const messageId = params.messageid;
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
    try {
        const updatedResult = await UserModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull:{
                    messages:{_id: messageId}
                }
            }
        )
        if(updatedResult.modifiedCount ===0){
            return NextResponse.json(new apiResponse(
                'Message Not Found',
                false,
                404
            ))
        }
        return NextResponse.json(new apiResponse(
            'Message Successfully Deleted',
            true,
            200
        ))
    } catch (error) {
        return NextResponse.json(
            new apiResponse('Error Deleting Mesage',
            false,
            500)
        )
    }
}