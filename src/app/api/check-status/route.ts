import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {username} = await request.json()
    const user = await UserModel.findOne({username: username});
    if(!user){
        return NextResponse.json({
            message: 'No User Found',
            success: false
        },{status: 404})
    }
    return NextResponse.json({
        message: 'Information fetched Successfully',
        isAcceptingMessages: user.isAcceptingMessage,
        sucess: true
    },{status: 200})
}