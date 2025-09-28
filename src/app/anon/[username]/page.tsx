'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, MessageCircle, Send, UserCircle, Shield, Star, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

// Custom Textarea component as fallback
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  // State for AI suggestions
  const [completion, setCompletion] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        ...data,
        username,
      });

      toast.success('Success', {
        description: response.data.message
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error: any) {
      console.log(error.response?.data?.message);
      toast.error('Error', {
        description: error.response?.data?.message || "Error in send message api"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setError(null);
    try {
      const response : any = await axios.post('/api/suggest-messages', {});
      setCompletion(response.data.suggestions || initialMessageString);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch suggested messages');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Anonymous Message
          </h1>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-6 inline-block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-slate-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-600">Sending to</p>
                <p className="font-bold text-slate-900 text-lg">@{username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Anonymous Message</h2>
              <p className="text-slate-600">Share your thoughts without revealing your identity</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-slate-900">
                      Your Message
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Write your anonymous message here... Be respectful and authentic."
                          className="resize-none bg-white border border-slate-200 rounded-md shadow-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-400 transition-all duration-200 text-slate-900 placeholder:text-slate-500 min-h-[120px]"
                          {...field}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                          {field.value?.length || 0}/500
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Privacy Notice */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-slate-600" />
                  </div>
                  <p className="text-slate-700">
                    Your message will be sent <strong>completely anonymously</strong>. The recipient won't know who sent it.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                {isLoading ? (
                  <Button 
                    disabled
                    className="bg-slate-800 text-white font-semibold px-8 py-3 rounded-md shadow-sm"
                  >
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Message...
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !messageContent}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3 rounded-md shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                    <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Send Anonymous Message
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Suggested Messages Section */}
        <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Message Suggestions</h3>
                <p className="text-slate-600">Get inspired with AI-generated conversation starters</p>
              </div>
            </div>

            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Get New Suggestions
                </>
              )}
            </Button>
          </div>

          <p className="text-slate-600 mb-4 text-center">
            Click on any message below to use it as your anonymous message
          </p>

          <div className="space-y-4">
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleMessageClick(message)}
                  className="w-full h-auto p-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-left justify-start group"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-3 h-3 text-slate-600" />
                    </div>
                    <span className="text-sm leading-relaxed group-hover:text-slate-700 transition-colors break-words">
                      {message}
                    </span>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>

        <Separator className="my-12 bg-slate-200" />

        {/* Call to Action Section */}
        <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Want Your Own Message Board?
            </h2>
            
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Create your own AnonVoice account and start receiving anonymous messages from your friends, 
              followers, and community. It's completely free and takes less than a minute to set up.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">100% Anonymous</h3>
                <p className="text-sm text-slate-600">Complete privacy protection</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Easy Setup</h3>
                <p className="text-sm text-slate-600">Get started in under a minute</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Always Free</h3>
                <p className="text-sm text-slate-600">No hidden costs or limits</p>
              </div>
            </div>

            <Link href="/sign-up">
              <Button className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3 rounded-md shadow-sm hover:shadow-md transition-all duration-200 group">
                Create Your Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}