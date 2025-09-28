import {UserModel,MessageModel,ActivityModel} from "@/model"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
export async function GET(request : Request){

    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        if(!session){
            return Response.json({
                success : false,
                message : "unauthorized",
                activity : []
            },
            {
                status : 401
            })
        }
        const user = session.user._id;
        if(!user){
            return Response.json({
                success : false,
                message : "unauthorized",
                activity : []
            },
            {
                status : 401
            })
        }

        const userActivity = await ActivityModel.findOne({user:user}).select('activity');
        if(!userActivity || userActivity.activity.length===0){
             return Response.json({
                success : true,
                message : "no activity yet",
                activity : []
            },
            {
                status : 200
            })
        }

        return Response.json({
                success : true,
                message : "activities fetched successfully",
                activity : userActivity.activity
            },
            {
                status : 200
        })
    } catch(error : any){
        return Response.json({
                    success : false,
                    message : "problem in get-recent-activity api",
                    activity : []
                },
                {
                    status : 500
                })
    }
}

