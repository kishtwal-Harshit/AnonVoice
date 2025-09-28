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
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const result = await UserModel.aggregate([
            {$match : {_id : newId}},
            {$unwind : '$messages'},
            { $match: { 'messages.createdAt': { $gte: sevenDaysAgo } } },
            { $count: 'weeklyMessageCount' }

        ])
        //console.log("user=",user);
        console.log(result);
        if(result.length===0){
            return Response.json({
                success : false,
                message : "message count fetched successfully",
                data : 0
            },
        {status : 201})
        }


        console.log('count=',result[0].weeklyMessageCount)
        return Response.json({
                success : true,
                message : "message count fetched successfully",
                data : result[0].weeklyMessageCount
        },
    {
        status : 201
    })
    } catch(error : any){
        console.error('here');
        return Response.json({
                success : false,
                message : "error in get-message-count api",
                data : []
        },
    {
        status : 500
    })
    }
    
}