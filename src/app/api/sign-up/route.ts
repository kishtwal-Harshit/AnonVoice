import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import {UserModel} from "@/model";
import bcrypt from 'bcrypt';
export async function POST(request : Request){
    await dbConnect();

    try{

        const {email, username, password} = await request.json();
        if(!email || !username || !password || [email,username,password].some(field=>field.trim()==="")){
            const failResponse : ApiResponse = {
                success : false,
                message : "all fields required"
            }
            return Response.json(failResponse,{status : 401});
        }


        const existingUserVerifiedByUsername = await UserModel.findOne({username,isVerified : true});
        if(existingUserVerifiedByUsername){
            const failResponse : ApiResponse = {
                success : false,
                message : "username already taken"
            }
            return Response.json(failResponse,{status : 401});
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000+Math.random()*900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                const failResponse : ApiResponse = {
                success : false,
                message : "email already taken"
            }
                return Response.json(failResponse,{status : 401});
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+60*60);
                await existingUserByEmail.save();
            }
        }
        else{
            //user first time using app, register 
            const hashedPassword = await bcrypt.hash(password,await bcrypt.genSalt(10));
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser =  await UserModel.create({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            },
            );
        }

        //send verification mail
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            const failResponse : ApiResponse = {
                success : false,
                message : emailResponse.message
            }
            return Response.json(failResponse,{status : 401});
        }

        const successResponse : ApiResponse = {
            success : true,
            message : "user registeration successful! please verify your email"
        }

        return Response.json(successResponse,{status : 201});

    } catch(error){
        console.log("error regestring user",error);
        const failResponse : ApiResponse = {
                success : false,
                message : "error registering user"
        }
        return Response.json(failResponse,
    {
        status : 500
    })
    }
}