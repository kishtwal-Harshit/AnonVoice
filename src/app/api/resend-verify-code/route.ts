import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import {UserModel} from "@/model";


export async function POST(request : Request){

    await dbConnect();
    try{
       const {username} = await request.json();
       if(!username) {
            return Response.json({
                success : false,
                message : "username not found",
                data : []
            },{status : 404})
       }

       const user = await UserModel.findOne({username : username});
       if(!user) {
            return Response.json({
                success : false,
                message : "user does not exist",
                data : []
            },{status : 401})
       }

       const newVerificationCode = Math.floor(100000+Math.random()*900000).toString();
       const expiryDate = new Date()
       expiryDate.setHours(expiryDate.getHours()+1)
       const updateVerificationCode = await UserModel.findOneAndUpdate(
        {username},
        {
            verifyCode : newVerificationCode,
            verifyCodeExpiry : expiryDate
        }
       )

       if(!updateVerificationCode){
            return Response.json({
                success : false,
                message : "error in updating verification code",
                data : []
            },{status : 500})
       }

       const emailResponse = await sendVerificationEmail(user!.email,username,newVerificationCode);
       if(!emailResponse.success){
            return  Response.json({
                success : false,
                message : emailResponse.message,
                data : []
            },{status : 401});
        }
       
       
        return  Response.json({
            success : true,
            message : "mail for new verification code sent successfully",
            data : []
        },{status : 201});
        

    } catch(error : any){
        console.log(error.message?.data);
        return  Response.json({
            success : false,
            message : "error in resend verify code api",
            data : []
        },{status : 401});
        }
}
