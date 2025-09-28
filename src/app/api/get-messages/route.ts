import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model";
import { User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request : Request){
    
    await dbConnect();
    const session = await getServerSession(authOptions);
    if(!session){
        return Response.json({
                success : false,
                message : "unauthorized",
                data : []
                },
                {
                status : 401
        })
    }

    const userId = session.user._id;
    if(!userId){
        return Response.json({
                success : false,
                message : "unauthorized",
                data : []
            },
            {
                status : 401
            })
    }
   // const userId : any = new mongoose.Types.ObjectId(user._id);
    try{
        const newId = new mongoose.Types.ObjectId(userId.toString());
        const user = await UserModel.aggregate([
            {$match : {_id : newId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt':-1}},
            {$group: {_id : '$_id', messages : {$push : '$messages'}}}
        ])
        //console.log("user=",user);
        if(!user){
            return Response.json({
                success : false,
                message : "user not found",
                data : []
            },
        {status : 401})
        }

        if(user.length===0){
            return Response.json({
                success : true,
                message: "no messages available",
                data : []
            },
        {status : 201})
        }
        
        return Response.json({
                success : true,
                message : "messages fetched successfully",
                data : user[0].messages
        },
    {
        status : 201
    })
    } catch(error){
        return Response.json({
                success : false,
                message : "error in get message api",
                data : []
        },
    {
        status : 500
    })
    }
    
}