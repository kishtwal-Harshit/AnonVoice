import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model";
import { User} from "next-auth";

//update message accepting status
export async function POST(request : Request){
    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        if(!session){
            return Response.json({
                success : false,
                message : "unauthorized"
            },
            {
                status : 401
            })
        }
        const user = (session.user as User)._id;
        if(!user){
            return Response.json({
                success : false,
                message : "unauthorized"
            },
            {
                status : 401
            })
        }

        const {acceptMessages} = await request.json();
        //console.log('status=',acceptMessages);

        const updatedUser = await UserModel.findByIdAndUpdate(
            user,
            {
                isAcceptingMessage : acceptMessages
            },
            {
                new : true
            }
        );
        //console.log('user->',updatedUser);
        if(!updatedUser){
            return Response.json({
                success : false,
                message : "could not update user"
            },
            {
                status : 500
            })
        }
        return Response.json({
            success : true,
            message : "user updated successfully",
            updatedUser
        },
        {
            status : 201
        })

    } catch(error){
        console.error('error in accept messages api',error);
        return Response.json({
            success : false,
            message : "error in accept messages api"
        },
    {
        status : 500
    })
}
}

//get message accepting status
export  async function GET(request : Request){
    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        if(!session){
            return Response.json({
                success : false,
                message : "unauthorized"
            },
            {
                status : 401
            })
        }
        const user = (session.user as User)._id;
        if(!user){
            return Response.json({
                success : false,
                message : "unauthorized"
            },
            {
                status : 401
            })
        }
        const existingUser : User | null = await UserModel.findById(user);
        if(!existingUser){
            return Response.json({
                success : false,
                message : "user not found"
            },
            {
                status : 404
            })
        }
        return Response.json({
            success : true,
            message : "fetched user successfully",
            isAcceptingMessage : existingUser.isAcceptingMessage
        },
        {
            status : 201
        })          
    } catch(error){
        console.error('error in get accept messages api',error);
        return Response.json({
            success : false,
            message : "error in get accept messages api"
        },
    {
        status : 500
    })
    }
}   