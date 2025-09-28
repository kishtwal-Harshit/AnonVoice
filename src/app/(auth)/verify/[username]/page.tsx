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
import { Loader2, MessageCircle, Mail, Shield, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Verify Your Account
          </h1>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-lg mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-slate-700 font-medium">Code sent to your email</p>
            </div>
            <p className="text-sm text-slate-600">
              We've sent a 6-digit verification code to verify your identity
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-600" />
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                          <div key={index} className="relative">
                            <Input
                              ref={(el) => { inputRefs.current[index] = el; }}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleInputChange(index, e, field)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              className="w-14 h-14 text-center text-xl font-bold bg-white border-2 border-slate-200 rounded-xl shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all duration-300 hover:border-slate-300"
                            />
                            {digit && (
                              <div className="absolute inset-0 bg-slate-100 rounded-xl opacity-20 pointer-events-none"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-center mt-2" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting} 
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    Verifying Account...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Verify Account
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Info */}
          
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-3 h-3 text-slate-600" />
            </div>
            <p>
              This verification step ensures the security of your AnonVoice account and protects your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;