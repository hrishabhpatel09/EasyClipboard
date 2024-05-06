import mongoose,{Schema, Document, Collection} from 'mongoose'

export interface Message extends Document{
    content: string,
    createdAt: Date
}

const messageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
},{timestamps: true})

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    message: Message[]
}

const userSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique: true
    },
    email:{
        type:String,
        required:[true,"username is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,'Please use a Valid Email Address']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    isAcceptingMessage:{
        type:Boolean,
       default: true
    },
    message: [messageSchema]
},{timestamps: true})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model('User',userSchema)

export default UserModel