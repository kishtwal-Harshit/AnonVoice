'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '', 
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error,
        });
      }

      if (result?.ok && !result.error) {
        toast.success("Login Successful!", {
          description: "Welcome back to AnonVoice"
        });
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Error signing in", error);
      toast.error("Something went wrong", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-xl mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-lg">Sign in to continue your anonymous journey</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
          {/* Security Badge */}
          <center>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Secure Login
          </div>
          </center>
          

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-semibold">Email or Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          placeholder="Enter your email or username" 
                          {...field}
                          className="pl-11 h-12 bg-white border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-400 rounded-md transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-semibold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field}
                          className="pl-11 h-12 bg-white border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-400 rounded-md transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">New to AnonVoice?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              Join our anonymous community today
            </p>
            <Link href="/sign-up">
              <Button 
                variant="outline" 
                className="w-full h-12 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-semibold rounded-md transition-all duration-200"
              >
                Create New Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-slate-700 transition-colors">
              Help Center
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Anonymous Messaging</h3>
            <p className="text-xs text-slate-600">Send and receive messages without revealing identity</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Privacy First</h3>
            <p className="text-xs text-slate-600">Your data and conversations stay completely private</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;