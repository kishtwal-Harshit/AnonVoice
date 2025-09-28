'use client'
import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { MessageCircle, Shield, Users, ArrowRight, Star } from "lucide-react"
import messages from "@/messages.json"
import AutoPlay from "embla-carousel-autoplay"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              100% Anonymous & Secure
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Ready to enter the 
            <br className="hidden md:block" />
            Anonymous World?
            <span className="relative">
              
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-400 rounded-full transform scale-x-0"></div>
            </span>
          </h1>
          
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore <span className="font-semibold text-slate-800">AnonVoice</span> - where authentic conversations happen without judgment, 
            and your identity remains completely private
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/sign-up">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-semibold px-8 py-3 rounded-full transition-all duration-200">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Preview */}
        <section className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
            <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Anonymous Messages</h3>
                <p className="text-sm text-slate-600">Send & receive without revealing identity</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Privacy First</h3>
                <p className="text-sm text-slate-600">Your data stays private & secure</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Global Community</h3>
                <p className="text-sm text-slate-600">Connect with people worldwide</p>
              </div>
            </div>
          </div>
        </section>

        {/* Messages Carousel */}
        <section className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              See What People Are Sharing
            </h2>
            <p className="text-slate-600">Real anonymous conversations from our community</p>
          </div>

          <Carousel 
            plugins={[AutoPlay({ delay: 2000 })]}
            className="w-full max-w-xs mx-auto"
          >
            <CarouselContent>
              {messages.map((msg, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="h-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-slate-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900">
                              {msg.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-xs text-slate-500">Anonymous</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="bg-slate-50 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
                          <p className="text-slate-700 text-center leading-relaxed font-medium">
                            "{msg.content}"
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                          <span>Shared anonymously</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm max-w-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Ready to Share Your Voice?
            </h3>
            <p className="text-slate-600 mb-6">
              Join thousands of users sharing authentic thoughts and connecting meaningfully
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">AnonVoice</span>
            </div>
            
            <p className="text-slate-600">
              &copy; 2025 AnonVoice. All rights reserved. Made with privacy in mind.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-slate-700 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}