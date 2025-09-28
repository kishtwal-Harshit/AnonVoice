import dbConnect from "@/lib/dbConnect";
import {UserModel} from "../../../model";
import {z} from 'zod'
import {userNameValidation} from '@/schemas/signUpSchema'

export async function POST(request : Request){

    await dbConnect();
    try{
        
        const {username, code} = await request.json();
        console.log(code);
        const decodedUsername = decodeURIComponent(username);
        console.log(decodedUsername);
        const user = await UserModel.findOne({username : decodedUsername});
        
        if(!user){
            return Response.json({
            success : false,
            message : "user not found"
        },
        {
            status : 500
        })
        }
        console.log(user);
        console.log(user.verifyCode);
        console.log(code);
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        
        if(isCodeValid && isCodeNotExpired){
            await UserModel.findOneAndUpdate(
                {
                    username
                },
                {
                    isVerified : true
                }
            )
            return Response.json(
            {
                success : true,
                message : "account verified successfully"
            },
            {
                status : 201
            }
            )
        }
        
        if(!isCodeNotExpired){
            return Response.json({
            success : false,
            message : "code is expired"
            },
            {
                status : 400
            })
        }
        else{
            return Response.json({
            success : false,
            message : "code is invalid"
            },
            {
                status : 400
            })
        }


    } catch(error){
        console.error('error verifying user',error);
        return Response.json({
            success : false,
            message : "error verifying user"
        },
    {
        status : 500
    })
    }
}