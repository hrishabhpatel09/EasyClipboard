import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import apiResponse from "@/helper/apiResponse";
import UserModel from "@/model/User.model";

export async function GET(request: NextRequest) {
    connectDB();
    const {searchParams} = new URL(request.url);
    const queryParams ={
        username: searchParams.get('username')
    }
    try {
        const user = await UserModel.findOne({username: queryParams.username});
        if(user){
            return NextResponse.json(new apiResponse(
                'Username is Already Taken',
                false,
                200
            ))
        }
        else{
            return NextResponse.json(new apiResponse(
                'Username is available',
                true,
                200
            ))
        }
    } catch (error) {
        return NextResponse.json(new apiResponse(
            'Internal Server Error',
            false,
            500
        ))
    }
}