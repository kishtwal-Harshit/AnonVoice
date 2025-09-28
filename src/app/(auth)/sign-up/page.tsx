'use client';

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, User, Mail, Lock, ArrowRight, Shield, CheckCircle, XCircle } from "lucide-react";

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedUserName] = useDebounceValue(username, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUserName) {
        setIsCheckingUsername(true);
        setUsernameMsg('');
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${debouncedUserName}`);
          setUsernameMsg(response.data.message);
        } catch (error: any) {
          setUsernameMsg(error.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUserName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success('Success', {
        description: response.data.message
      });
      router.replace(`/verify/${data.username}`);
    } catch (error: any) {
      toast.error("Sign-up failed", {
        description: error.response?.data.message ?? "An error occurred."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameAvailable = usernameMsg.includes("available");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-xl mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Join AnonVoice
          </h1>
          <p className="text-slate-600 text-lg">Create your account to begin your anonymous journey</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
          {/* Security Badge */}
          <center>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            100% Anonymous & Secure
          </div>
          </center>
          

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-semibold">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          placeholder="Choose a unique username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                          className="pl-11 pr-11 h-12 bg-white border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-400 rounded-md transition-all duration-200"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isCheckingUsername ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                          ) : usernameMsg ? (
                            isUsernameAvailable ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )
                          ) : null}
                        </div>
                      </div>
                    </FormControl>
                    {usernameMsg && (
                      <div className={`flex items-center gap-2 text-sm mt-2 ${
                        isUsernameAvailable ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {isUsernameAvailable ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {usernameMsg}
                      </div>
                    )}
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          placeholder="Enter your email address" 
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
                          placeholder="Create a strong password" 
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Privacy Protection</h4>
                <p className="text-sm text-slate-600">
                  Your email is only used for account verification and security. We never share your information or reveal your identity.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link href="/sign-in">
              <Button 
                variant="outline" 
                className="w-full h-12 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-semibold rounded-md transition-all duration-200"
              >
                Sign In to Existing Account
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

        {/* Benefits Preview */}
        <div className="mt-12 space-y-4">
          <h3 className="text-center text-slate-900 font-semibold mb-4">What you'll get:</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Anonymous Messages</h4>
                <p className="text-xs text-slate-600">Receive honest feedback without revealing identities</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Complete Privacy</h4>
                <p className="text-xs text-slate-600">Your personal information stays completely secure</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Personal Dashboard</h4>
                <p className="text-xs text-slate-600">Manage your messages and settings in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;