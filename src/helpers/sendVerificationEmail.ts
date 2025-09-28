import {resend} from '../lib/resend'
import { verificationEmail } from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(
    email : string,
    username : string,
    otp : string
) :  Promise<ApiResponse>{
    try{
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to : email,
            subject: 'AnonVoice | Verification Code',
            html: verificationEmail({username,otp})
});

        return {success : true, message : "sent verification email successfully",}
    } catch(emailError){
        console.error("error sending verification email",emailError);
        return {success : false, message : "failed to send verification email",}
    }
}