'use client';

import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, KeyRound, User, ArrowLeft } from 'lucide-react';
import { verifySchema } from '@/schemas/verifySchema';
import { useRef, useState, useEffect } from 'react';

const VerifyAccountPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username);
  
  // State to manage the 6 individual OTP digits
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Update the main form value
    const combinedOtp = newOtp.join('');
    field.onChange(combinedOtp);

    // Move focus to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error : any) {
      toast.error(error.response?.data.message ?? 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Verify Your Account
          </h1>
          <p className="text-slate-600">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Username Display */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Verifying account for</p>
              <p className="text-slate-900 font-semibold">@{username}</p>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-slate-600" />
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e, field)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-lg font-bold border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-center mt-2" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting} 
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Verifying Account...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Verify Account
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 space-y-4">
          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={() => {
                // Add resend logic here
                toast.info('Resend feature coming soon')
              }}
              className="text-sm text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-medium"
              disabled={form.formState.isSubmitting}
            >
              Resend Code
            </Button>
          </div>

          {/* Back to Sign In */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/sign-in')}
              className="text-slate-600 hover:text-slate-900 font-medium"
              disabled={form.formState.isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-3 h-3 text-slate-600" />
            </div>
            <p>
              This verification step ensures the security of your anonymous account and protects your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;