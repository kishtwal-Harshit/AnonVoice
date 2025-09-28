'use client'
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Message } from "../model" // Assuming the model path
import { toast } from "sonner"
import axios from "axios"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response : any = await axios.post(`/api/delete-message/${message._id}`);
      toast.success('Success', {
          description: response.data.message
      });
      onMessageDelete(message._id as string);
    } catch (error: any) {
        toast.error('Error', {
            description: error.response?.data.message ?? "Failed to delete message"
        })
    }
  }

  // Formatting date for better display
  const messageDate = new Date(message.createdAt).toLocaleString();

  return (
    <Card className="relative card-bordered">
      <CardContent className="p-4">
        <p className="text-md font-semibold mb-2">{message.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-sm text-gray-500">{messageDate}</p>
      </CardFooter>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full w-8 h-8">
            <X className="w-5 h-5"/>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

