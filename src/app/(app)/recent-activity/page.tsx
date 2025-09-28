'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw, Clock, Activity, BarChart3, MessageSquare, Calendar } from 'lucide-react';

const RecentActivityPage = () => {
    const [activities, setActivities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session, status } = useSession();

    const fetchActivities = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response : any= await axios.get('/api/get-recent-activity');
            setActivities(response.data.activity || []);
            if (refresh) {
                toast.success('Success', {
                    description: "Refreshed recent activity"
                });
            }
        } catch (error: any) {
            const axiosError = error as any;
            toast.error('Error', {
                description: axiosError.response?.data.message || "Error fetching recent activity"
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchActivities();
        }
    }, [status, fetchActivities]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm text-center max-w-md">
                    <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading your session...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm text-center max-w-md">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Required</h2>
                    <p className="text-slate-600">Please login to view your recent activity</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
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
                                    Recent Activity
                                </h1>
                                <p className="text-slate-600">Track your account activity from the last 7 days</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Activity Overview</h3>
                                    <p className="text-slate-600">
                                        {activities.length} activities recorded in the last 7 days
                                    </p>
                                </div>
                            </div>
                            
                            <Button
                                variant="outline"
                                onClick={() => fetchActivities(true)}
                                disabled={isLoading}
                                className="border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-medium rounded-md transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                )}
                                Refresh Activity
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-8 bg-slate-200" />

                    {/* Activity Feed */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Activity className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900">Activity Timeline</h3>
                                <p className="text-slate-600">Your recent account interactions</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-600 font-medium">Loading activities...</p>
                                </div>
                            ) : activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.map((activity, index) => (
                                        <div 
                                            key={index} 
                                            className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:bg-slate-100 transition-colors duration-200"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                                                        <Activity className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-slate-900 leading-relaxed font-medium text-base mb-2">
                                                        {activity}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>Activity #{index + 1}</span>
                                                        </div>
                                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                        <span>Recent</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No Recent Activity</h4>
                                    <p className="text-slate-600 mb-2">Your activity timeline is empty</p>
                                    <p className="text-sm text-slate-500">
                                        Send messages or receive feedback to see activity here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default RecentActivityPage;