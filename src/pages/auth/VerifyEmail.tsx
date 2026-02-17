import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/config/firebase';

const VerifyEmail = () => {
  const [resendCountdown, setResendCountdown] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state, sessionStorage, or current user
  const emailFromState = (location.state as any)?.email;
  const emailFromStorage = sessionStorage.getItem('pendingVerificationEmail');
  const userEmail = emailFromState || emailFromStorage || user?.email || '';

  // Reload user on mount to get fresh emailVerified status
  useEffect(() => {
    const checkVerification = async () => {
      if (auth.currentUser) {
        try {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            sessionStorage.removeItem('pendingVerificationEmail');
            toast.success('Email already verified!');
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error checking verification:', error);
        }
      }
    };
    
    if (!authLoading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else {
        checkVerification();
      }
    }
  }, [user, authLoading, navigate]);

  // Cleanup countdown timer
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Start countdown on mount
  useEffect(() => {
    startResendCountdown();
  }, []);

  // Start countdown timer for resend button
  const startResendCountdown = () => {
    setResendCountdown(30);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('No user found. Please login again.');
      navigate('/login');
      return;
    }

    setResendLoading(true);
    try {
      await sendEmailVerification(currentUser);
      toast.success('Verification email sent again. Check your inbox & spam folder.');
      startResendCountdown();
    } catch (err: any) {
      console.error('Resend verification error:', err);
      if (err.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please wait a few minutes before trying again.');
        // Set a longer cooldown (60s) on rate limit
        setResendCountdown(60);
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              if (countdownRef.current) clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error('Failed to send verification email. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Handle "I Have Verified" button click
  const handleVerifyCheck = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('No user found. Please login again.');
      sessionStorage.removeItem('pendingVerificationEmail');
      navigate('/login');
      return;
    }

    setVerifyLoading(true);
    try {
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        sessionStorage.removeItem('pendingVerificationEmail');
        toast.success('Email verified successfully! Welcome to Sree Rasthu Silvers!');
        navigate('/', { replace: true });
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch (err: any) {
      console.error('Verify check error:', err);
      toast.error('Failed to check verification status. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('pendingVerificationEmail');
      await logout();
      toast.success('Logged out successfully.');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center font-poppins">
      <div className="px-4">
        <div className="w-full max-w-md">
          <div className="p-8">
            {/* Email Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-xl font-bold text-gray-900 font-poppins">
                Verify Your Email
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your account has been created successfully!
                <br />
                Please check your inbox and click the verification link.
              </p>
            </div>

            {/* User Email Display */}
            <div className="bg-blue-50 rounded-xl p-3 mb-6 text-center">
              <p className="text-xs text-gray-500 mb-1">Verification email sent to:</p>
              <p className="text-blue-600 font-normal text-xs md:text-base overflow-hidden text-ellipsis whitespace-nowrap px-2">
                {userEmail}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Resend Verification Email Button */}
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={resendCountdown > 0 || resendLoading}
                className="w-full h-11 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium transition-all"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCountdown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend in {resendCountdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              {/* I Have Verified Button */}
              <Button
                onClick={handleVerifyCheck}
                disabled={verifyLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all"
              >
                {verifyLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    I Have Verified
                  </>
                )}
              </Button>
            </div>

            {/* Tip */}
            <div className="mt-5 p-2.5 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-600 text-center flex items-center justify-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span><span className="font-medium">Tip:</span> Didn't receive email? Check your spam folder.</span>
              </p>
            </div>

            {/* Logout Link */}
            <div className="mt-5 text-center">
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Logout and try different account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
