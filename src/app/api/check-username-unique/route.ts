import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model";
import {z} from 'zod'
import {userNameValidation} from '@/schemas/signUpSchema'

const UsernameQuerySchema = z.object({
    username : userNameValidation
})

export async function GET(request : Request){

    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username : searchParams.get('username')
        }
        //console.log(`username=${queryParam.username}`);
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success : false,
                message : usernameErrors.length>0 ? usernameErrors.join(', ') : 'invalid query parameters'  
            },
            {
                status : 400
            })
        }

        const {username} = result.data;
        //console.log(username);
        const userExistAndVerified = await UserModel.findOne({username, isVerified : true});
        if(userExistAndVerified){
            return Response.json({
                success : false,
                message : "username already taken"
            },
            {
                status : 400
            })
        }

        return Response.json(
            {
                success : true,
                message : "username is available"
            },
            {
                status : 201
            }
        )


    } catch(error){
        console.error('error checking username',error);
        return Response.json({
            success : false,
            message : "error checking username"
        },
    {
        status : 500
    })
    }
}