import { CredentialsProvider } from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcryptjs'
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {label: 'email', type: 'text', placeholder: 'email'},
                password: {label: 'password', type: 'password', placeholder: 'password'},
            },
            async authorize(credentials:any):Promise<any>{
                await connectDB();
                try {
                    const user = await UserModel.findOne({
                        email: credentials.identifier.email
                    })
                    if(!user){
                        throw new Error('No user Found with this email')
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify Your Account first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect Password")
                    }
                    else{
                        return user;
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({session, token}){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
                return session
        }
    }
}