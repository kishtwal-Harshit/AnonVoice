import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel,MessageModel,ActivityModel} from "@/model";
import { User} from "next-auth";
import { Message } from "@/model";
import mongoose from "mongoose";
import { useSession } from "next-auth/react";
import { truncate } from "node:fs";

export async function POST(request : Request){

    await dbConnect();
    const {username, content} = await request.json();
    try{
       /* const session = await getServerSession(authOptions);
        if(!session){
            return Response.json({
                success : false,
                message : "unauthorized"
            },
            {
                status : 401
            })
        }
        const sender = session.user._id;
        const user = await UserModel.findOne({username});
        if(!user){
        return Response.json({
                success : false,
                message : "user not found"
            },
            {
                status : 404
            })
        }*/

        //check if user is accepting messages
        const user = await UserModel.findOne({username});
        if(!user){
        return Response.json({
                success : false,
                message : "user not found"
            },
            {
                status : 404
            })
        }
       // console.log('user=',username);
        //console.log('status=',user.isAcceptingMessage);
        if(!user.isAcceptingMessage){
            return Response.json({
                success : false,
                message : "user is not accepting messages"
            },
            {
                status : 403
            })
        }

        const newMessage = {content,createdAt : new Date()};

        user.messages.push(newMessage as Message);
        await user.save();

        /*const saveActivityinSender = await ActivityModel.updateOne(
            {user : sender},
            {$push : {activity:`message sent to  : ${username} at ${new Date().toLocaleString()}`}},
            {upsert : true}
        )*/

        /*if(!saveActivityinSender){
            return Response.json({
                success : false,
                message : "unable to save activity"
            },
            {
                status : 403
            })
        }*/

        const saveActivityinReceiever = await ActivityModel.updateOne(
            {user : user._id},
            {$push : {activity:`anonymous message receieved at ${new Date().toLocaleString()}`}},
            {upsert : true}
        )

         /*if(!saveActivityinReceiever){
            return Response.json({
                success : false,
                message : "unable to save activity"
            },
            {
                status : 403
            })
        }*/

        return Response.json({
                success : true,
                message : "message sent successfully"
            },
            {
                status : 201
            })

    } catch(error){
        return Response.json({
                success : false,
                message : "error in send message api"
            },
            {
                status : 500
            })
    }
}