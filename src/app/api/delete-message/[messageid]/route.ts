import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel,ActivityModel} from "@/model";
import { User} from "next-auth";
import mongoose from "mongoose";


export async function POST(request: Request, { params }: { params: { messageid: string } }) {
    
    await dbConnect();
    const messageId = params.messageid;

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

    const user = (session.user as User);
    if(!user){
        return Response.json({
                success : false,
                message : "unauthorized"
            },
            {
                status : 401
            })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    //const username = await UserModel.findOne({_id : userId}).select("username");
    //console.log("username=",username);
    try{
        const updatedResult = await UserModel.updateOne(
            {_id: userId},
            {
                $pull : {messages: {_id: messageId}}
            }
        )

        if(updatedResult.modifiedCount===0){
            return Response.json({
                success : false,
                message : "message not found or already deleted"
            },
            {
                status : 404
            })
        }

        const addActivity = await ActivityModel.findOneAndUpdate(
            {user : userId},
            {
                $push : {activity : `feedback of an anonymous user was deleted at ${new Date().toLocaleString()}`}
            },
            {
                upsert : true
            }
        )
        return Response.json({
                success : true,
                message : "message deleted successfully"
            },
            {
                status : 200
            })
    } catch(error:any){
        console.log('error in delete message : ',error.data.message);
        return Response.json({
                success : false,
                message : "error in delete message api"
            },
            {
                status : 500
            })
    }
    
}