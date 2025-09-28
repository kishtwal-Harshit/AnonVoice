 import mongoose, {Schema, Document, Mongoose} from 'mongoose';

 export interface Message extends Document{
    content : string;
    createdAt : Date;
 }

 const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true
    }
 })

 export interface User extends Document{
    username : string,
    email : string,
    password : string;
    verifyCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean,
    isAcceptingMessage : boolean,
    messages : Message[]
 }

 const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true,"username is required"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true,"email is required"],
        trim : true,
        unique : true,
        match : [/.+\@.+\..+/, 'please use a valid email address']
    },
    password : {
        type : String,
        required : [true,"password is required"],
    },
    verifyCode : {
        type : String,
        required : [true,"verify code is required"],
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true,"verifiy code expiry is required"],
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessage : {
        type : Boolean,
        default : true
    },
    messages : {
        type : [MessageSchema],
        default : []
    }

 })

 //Activity Schema
 export interface Activity extends Document{
    user : mongoose.Schema.Types.ObjectId,
    ref : "User",
    activity : string[],
    createdAt: Date
 } 

 const ActivitySchema : Schema<Activity> = new Schema({
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    activity: {
        type: [String],
        required: true,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
 })

 //TTL index to ensure activities older than 1 week gets automatically deleted
 ActivitySchema.index({ "createdAt": 1 }, { expireAfterSeconds: 604800 });

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema));
const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>("Message",MessageSchema));
const ActivityModel = (mongoose.models.Activity as mongoose.Model<Activity>) || (mongoose.model<Activity>("Activity",ActivitySchema));
export {UserModel,MessageModel,ActivityModel}