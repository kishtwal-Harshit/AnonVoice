'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import MessageCard from '@/components/MessageCard'
import { useState,useEffect,useCallback } from 'react'
import { Message } from '../../../model'
import {toast} from "sonner"
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw, Copy, Link as LinkIcon, MessageSquare, BarChart3, Settings, Globe } from 'lucide-react'
import { User } from 'next-auth'

const Dashboard=()=>{

    const [messages,setMessages] = useState<Message[]>([])
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [isSwitchLoading,setIsSwitchLoading] = useState<boolean>(false)
    const [curWeekMessageCount,setCurWeekMessageCount] = useState(0)

    

    const handleDeleteMessage = (messageId : string)=>{
        setMessages(messages.filter((message)=>message._id!=messageId));
        
    }

    const {data:session} = useSession();
    console.log('session=',session);
    
    
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues : {
            acceptMessages : session?.user?.isAcceptingMessage ?? false
        }
    })

    const {register,watch,setValue} = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessage = useCallback(async ()=>{
        setIsSwitchLoading(true)
        try{
            const response : any = await axios.get('/api/accept-messages')
            setValue('acceptMessages',response.data.isAcceptingMessage)
        }catch(error : any){
            const axiosError = error as any;
            toast.error('Error',{
                description : axiosError.response?.data.message || "Error in accept message api1"
            })
        }finally{
            setIsSwitchLoading(false);
        }
    },[setValue])

    const fetchMessages = useCallback(async(refresh : boolean = false)=>{
        setIsLoading(true);
        setIsSwitchLoading(false); 
        try{
            const response : any = await axios.get('/api/get-messages');
            console.log(response.data.data);
            setMessages(response.data.data);
            if(refresh){
                toast.success('Success',{
                    description : "Refreshed messages"
                })
            }
        }catch(error : any){
            console.log(error?.data?.message);
            const axiosError = error as any;
            toast.error('Error',{
                description : axiosError.response?.data.message || "Error in get-message api2"
            })
        }finally{
            setIsLoading(false);
        }
    },[setIsLoading,setMessages])

    const fetchCountOfCurWeekMessages = useCallback(async () => {
    try {
        const response : any = await axios.get('/api/get-message-count');
        
        const count : any = response.data.data;
        console.log('count=',count);
        
        setCurWeekMessageCount(count);

    } catch (error: any) {
        // This will now catch the error and tell you what's wrong
        console.error(error);
        
        // Set a fallback state so your UI doesn't break
        setCurWeekMessageCount(0);
    }
}, []);

    useEffect(()=>{
        if(!session || !session.user) return;
        fetchMessages()
        fetchAcceptMessage()
        fetchCountOfCurWeekMessages()
    },[session,setValue,fetchAcceptMessage,fetchMessages,fetchCountOfCurWeekMessages])

    const handleSwitchChange = async()=>{
        try{
            const response : any = await axios.post('/api/accept-messages',{
                acceptMessages : !acceptMessages
            })
            console.log('acceptance status : ',acceptMessages);
            setValue('acceptMessages',!acceptMessages)
            toast.success('Success',{
                description : response.data.message
            })
        }catch(error :any){
            const axiosError = error as any;
            toast.error('Error',{
                description : axiosError.response?.data.message || "Error in accept messages api3"
            })
        }
    }

    if(!session || !session.user){
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm text-center max-w-md">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Required</h2>
                    <p className="text-slate-600">Please login to access your dashboard</p>
                </div>
            </div>
        )
    }
    
    const { username } = session.user as User;

    const baseUrl = `${typeof window !== 'undefined' ? window.location.protocol : ''}//${typeof window !== 'undefined' ? window.location.host : ''}`;
    const profileUrl = `${baseUrl}/anon/${username}`;
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Profile URL copied to clipboard!", {
            description: "Share this link to receive anonymous messages"
        });
    }

    return (
        <>
            <Navbar/>
            <main className="min-h-screen bg-slate-50">
                <div className="container mx-auto p-4 md:p-8 max-w-6xl">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900">
                                    Dashboard
                                </h1>
                                <p className="text-slate-600">Manage your anonymous feedback and settings</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Total Messages</p>
                                    <p className="text-2xl font-bold text-slate-900">{messages.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Status</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {acceptMessages ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Messages this Week</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {curWeekMessageCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Share Link Section */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Your Anonymous Link</h2>
                                <p className="text-slate-600">Share this link to receive confidential feedback</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={profileUrl}
                                    readOnly
                                    className="flex-1 bg-white border border-slate-200 rounded-md px-4 py-3 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                />
                                <Button 
                                    onClick={copyToClipboard}
                                    className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-6 py-3 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Privacy Settings</h3>
                                    <p className="text-slate-600">
                                        Accept Anonymous Messages: {acceptMessages ? 
                                            <span className="text-emerald-600 font-medium">Enabled</span> : 
                                            <span className="text-amber-600 font-medium">Disabled</span>
                                        }
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                                <Switch
                                    {...register('acceptMessages')}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitchLoading}
                                    className="data-[state=checked]:bg-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8 bg-slate-200" />

                    {/* Messages Section */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">Anonymous Feedback</h3>
                                    <p className="text-slate-600">Confidential messages from your audience</p>
                                </div>
                            </div>
                            
                            <Button
                                variant="outline"
                                onClick={() => fetchMessages(true)}
                                disabled={isLoading}
                                className="border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-medium rounded-md transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                )}
                                Refresh
                            </Button>
                        </div>

                        <div className="mt-6">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-600 font-medium">Loading messages...</p>
                                </div>
                            ) : messages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {messages.map((message) => (
                                        <MessageCard
                                            key={message._id as string}
                                            message={message}
                                            onMessageDelete={handleDeleteMessage}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h4>
                                    <p className="text-slate-600 mb-6">Share your anonymous link to start receiving confidential feedback</p>
                                    <Button 
                                        onClick={copyToClipboard}
                                        className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-6 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard;