'use client'
import React from 'react'
import Link from 'next/link'
import {useSession , signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { MessageCircle, UserCircle, Activity, LogOut, LogIn } from 'lucide-react'

const Navbar = ()=>{

    const {data : session} = useSession();
    const user : any = session?.user
    const curPath = usePathname();
    return (
        <nav className='sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm'>
            <div className='container mx-auto px-4 md:px-6 py-4'>
                <div className='flex items-center justify-between'>
                    {/* Logo Section */}
                    <Link href="/" className='group flex items-center gap-3 hover:opacity-80 transition-opacity duration-200'>
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className='text-2xl font-bold text-slate-900'>
                            AnonVoice
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    {
                        session ? (
                            <div className="flex items-center gap-4">
                                {/* Welcome Message */}
                                <div className="hidden md:flex items-center gap-3 bg-slate-50 rounded-full px-4 py-2 border border-slate-200">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                        <UserCircle className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <span className='text-sm font-medium text-slate-700'>
                                        Welcome, <span className="text-slate-900 font-semibold">{user.username || user.email}</span>
                                    </span>
                                </div>
                                
                                {/* Navigation Buttons */}
                                <div className="flex items-center gap-2">
                                    {curPath !== '/recent-activity' && (
                                        <Link href={'/recent-activity'}>
                                            <Button className='bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200'>
                                                <Activity className="w-4 h-4 mr-2" />
                                                <span className="hidden sm:inline">Recent Activity</span>
                                                <span className="sm:hidden">Activity</span>
                                            </Button>
                                        </Link>
                                    )}
                                    
                                    <Button 
                                        onClick={() => signOut({ callbackUrl: '/sign-in' })}
                                        className='bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-medium px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200'
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Logout</span>
                                        <span className="sm:hidden">Exit</span>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Link href={'/sign-in'}>
                                <Button className='bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-md shadow-sm hover:shadow-md transition-all duration-200 group'>
                                    <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                    Login
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar;