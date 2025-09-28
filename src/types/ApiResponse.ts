import { Message } from "@/model";
export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMessages?: boolean;
    messages?: Message[];

}