import { NextRequest,NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import connectDB from "@/lib/dbConnect";
import bcrypt from 'bcryptjs'
import { sendEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: NextRequest) {
    await connectDB();

    try {
        const {email, password, username} = await request.json();
        console.log(email)
        const existingUser = await UserModel.findOne({email:email});
        if(existingUser){
            if(existingUser.isVerified){
                return NextResponse.json({
                    sucess: false,
                    message: 'Username is already taken.'
                },{status: 204})
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours()+1);
                const verifyCode = Math.floor((Math.random()*100000)+900000).toString();

                existingUser.email = email;
                existingUser.password = hashedPassword;
                existingUser.verifyCodeExpiry = expiryDate;
                existingUser.verifyCode = verifyCode;
                existingUser.messages = [];

                await existingUser.save();
                //sending verification Email
                const emailResponse = await sendEmail(email, username, verifyCode)
            
                if(!emailResponse.success){
                    return NextResponse.json({
                        success: false,
                        message: emailResponse.message
                    },{status: 500})
                }
                else{
                    return NextResponse.json({
                        success: true,
                        message: 'User Registered Successfully, please verify your email'
                    },{status: 201})
                }
            }
        }
        else{
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const verifyCode = Math.floor((Math.random()*100000)+900000).toString();
            const newUser = new UserModel({
                username: username,
                email: email,
                password: await bcrypt.hash(password,10),
                verifyCodeExpiry: expiryDate,
                verifyCode,
                message: []
            });

            await newUser.save();
            //sending verification Email
            const emailResponse = await sendEmail(email, username, verifyCode)
            
            if(!emailResponse.success){
                return NextResponse.json({
                    success: false,
                    message: emailResponse.message
                },{status: 500})
            }
            else{
                return NextResponse.json({
                    success: true,
                    message: 'User Registered Successfully, please verify your email'
                },{status: 201})
            }
        }
    } catch (error) {
        console.error('error registering user')
        return NextResponse.json({
            success: false,
            message: 'Error registering user'
        },{status: 500})
    }
}