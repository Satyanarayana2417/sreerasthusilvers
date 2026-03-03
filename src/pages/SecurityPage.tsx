// ============================================
// LOGIN & SECURITY PAGE — Enterprise-Grade
// Password, email, sessions, devices, login history,
// account deletion, 2FA preparation
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Shield, Lock, Mail, Eye, EyeOff, Loader2, Check, X, AlertTriangle,
  Smartphone, Monitor, Globe, Clock, LogOut, Trash2, ChevronRight, Key, Fingerprint,
  AlertCircle, CheckCircle2, XCircle, MapPin, RefreshCcw, Settings, UserX,
  ShieldCheck, ShieldAlert, Laptop, Info, ChevronDown,
} from 'lucide-react';
import {
  getSecuritySettings,
  updateSecuritySettings,
  getLoginHistory,
  getActiveSessions,
  terminateSession,
  terminateAllSessions,
  changeEmail,
  getTrustedDevices,
  removeTrustedDevice,
  trustCurrentDevice,
  requestAccountDeletion,
  cancelAccountDeletion,
  getDeletionStatus,
  secureLogout,
  logoutAllDevices,
  parseUserAgent,
} from '@/services/securityService';
import type {
  SecuritySettings,
  LoginHistoryEntry,
  UserSession,
  TrustedDevice,
  AccountDeletionRequest,
} from '@/types/security';

type SecurityTab = 'overview' | 'password' | 'sessions' | 'login-history' | 'devices' | 'account';

const SecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, loading: authLoading, logout } = useAuth();

  // Tab & UI
  const [activeTab, setActiveTab] = useState<SecurityTab>('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Show success message if redirected from password reset
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    location.state?.message ? { type: location.state.type || 'success', text: location.state.message } : null
  );

  // Clear location state after reading to prevent re-showing on refresh
  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
      // Auto-dismiss after 6 seconds
      setTimeout(() => setMessage(null), 6000);
    }
  }, []);

  // Data
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [deletionStatus, setDeletionStatus] = useState<AccountDeletionRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Password reset via email
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const resetAttempts = useRef(0);

  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);

  // General
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load initial data
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const [sec, history, sess, dev, deletion] = await Promise.all([
          getSecuritySettings(user.uid).catch(() => null),
          getLoginHistory(user.uid).catch(() => []),
          getActiveSessions(user.uid).catch(() => []),
          getTrustedDevices(user.uid).catch(() => []),
          getDeletionStatus(user.uid).catch(() => null),
        ]);
        setSettings(sec);
        setLoginHistory(history || []);
        setSessions(sess || []);
        setDevices(dev || []);
        setDeletionStatus(deletion);
      } catch (error) {
        console.error('Security data load error:', error);
        // Set defaults so page still works
        setSettings(null);
        setLoginHistory([]);
        setSessions([]);
        setDevices([]);
        setDeletionStatus(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Pre-fill user email for password reset
  useEffect(() => {
    if (user?.email && !resetEmail) {
      setResetEmail(user.email);
    }
  }, [user]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // ─── HANDLERS ─────────────────────────────

  const startResendCountdown = () => {
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      showMessage('error', 'Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      showMessage('error', 'Please enter a valid email address');
      return;
    }
    if (resetAttempts.current >= 3) {
      showMessage('error', 'Too many attempts. Please try again later.');
      return;
    }
    setSendingReset(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      resetAttempts.current += 1;
      setResetEmailSent(true);
      startResendCountdown();
    } catch (err: any) {
      console.error('Send reset email error:', err);
      if (err.code === 'auth/too-many-requests') {
        showMessage('error', 'Too many requests. Please try again later.');
      } else {
        // For security, always show success (prevents email enumeration)
        setResetEmailSent(true);
        startResendCountdown();
      }
    } finally {
      setSendingReset(false);
    }
  };

  const handleResendResetEmail = async () => {
    if (resendCountdown > 0) return;
    setSendingReset(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      startResendCountdown();
    } catch (err) {
      console.error('Resend error:', err);
    } finally {
      setSendingReset(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      showMessage('error', 'Please fill all fields');
      return;
    }
    setChangingEmail(true);
    try {
      await changeEmail(emailPassword, newEmail);
      showMessage('success', 'Email updated. Please verify your new email address.');
      setNewEmail('');
      setEmailPassword('');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update email');
    } finally {
      setChangingEmail(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!user) return;
    setActionLoading(sessionId);
    try {
      await terminateSession(user.uid, sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      showMessage('success', 'Session terminated');
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!user) return;
    setActionLoading('all-sessions');
    try {
      const count = await terminateAllSessions(user.uid);
      showMessage('success', `Logged out from ${count} device(s)`);
      await logout();
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!user) return;
    setActionLoading(deviceId);
    try {
      await removeTrustedDevice(user.uid, deviceId);
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      showMessage('success', 'Device removed');
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTrustDevice = async () => {
    if (!user) return;
    setActionLoading('trust-device');
    try {
      const device = await trustCurrentDevice(user.uid);
      setDevices((prev) => [device, ...prev]);
      showMessage('success', 'This device is now trusted');
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setActionLoading('delete');
    try {
      const req = await requestAccountDeletion(user.uid, deleteReason);
      setDeletionStatus(req);
      setShowDeleteConfirm(false);
      showMessage('success', 'Account deletion scheduled. You have 30 days to cancel.');
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelDeletion = async () => {
    if (!user) return;
    setActionLoading('cancel-delete');
    try {
      await cancelAccountDeletion(user.uid);
      setDeletionStatus(null);
      showMessage('success', 'Account deletion cancelled');
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleSetting = async (key: keyof SecuritySettings, value: boolean) => {
    if (!user) return;
    try {
      await updateSecuritySettings(user.uid, { [key]: value });
      setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getDeviceIcon = (os: string) => {
    if (os?.includes('Android') || os?.includes('iOS')) return <Smartphone className="w-5 h-5" />;
    if (os?.includes('Windows') || os?.includes('Mac') || os?.includes('Linux')) return <Monitor className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading security settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/account');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="hidden lg:block"><Header /></div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => activeTab === 'overview' ? navigate(-1) : setActiveTab('overview')} className="p-1 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {activeTab === 'overview' ? 'Login & Security' : 'Back to Security'}
        </h1>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-10 pb-24 lg:pb-10">
        {/* Account Status Banner */}
        {deletionStatus && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">Account Deletion Scheduled</p>
              <p className="text-xs text-red-700 mt-1">
                Your account will be permanently deleted on {formatDate(deletionStatus.scheduledDeletionAt)}.
                All data will be removed.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelDeletion}
                disabled={actionLoading === 'cancel-delete'}
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                {actionLoading === 'cancel-delete' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Cancel Deletion
              </Button>
            </div>
          </div>
        )}

        {/* ─── SECURITY OVERVIEW CARDS ────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Security Score */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 border border-gray-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Security</p>
                  <h2 className="text-base font-semibold text-gray-900">
                    {settings?.twoFactorEnabled ? 'Protected' : 'Basic Protection'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {settings?.twoFactorEnabled
                      ? 'Two-factor authentication is enabled'
                      : 'Enable 2FA for enhanced security'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {[
                { id: 'password' as SecurityTab, icon: <Key className="w-5 h-5" />, label: 'Change Password', desc: 'Update your password', color: 'text-blue-600' },
                { id: 'login-history' as SecurityTab, icon: <Clock className="w-5 h-5" />, label: 'Login History', desc: 'View recent login activity', color: 'text-purple-600' },
                { id: 'account' as SecurityTab, icon: <Settings className="w-5 h-5" />, label: 'Account Settings', desc: 'Email, notifications & more', color: 'text-gray-600' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>

            {/* 2FA Teaser */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 flex items-start gap-3">
              <Fingerprint className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Two-Factor Authentication</p>
                <p className="text-xs text-amber-700 mt-1">
                  2FA adds an extra layer of security. This feature is coming soon with OTP-based verification.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CHANGE PASSWORD (Email Reset Flow) ─────────────────── */}
        {activeTab === 'password' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {resetEmailSent ? (
                /* ── Step 2: Check Your Email ── */
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-5 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Mail className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    We've sent a password reset link to<br />
                    <strong className="text-gray-900">{resetEmail}</strong>
                  </p>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">What to do next:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Open the email and click the reset link</li>
                          <li>• Set your new password on the page that opens</li>
                          <li>• You'll be redirected back here once done</li>
                          <li>• The link expires in 1 hour</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Open Email App hint */}
                  <a
                    href={
                      resetEmail.includes('gmail') ? 'https://mail.google.com' :
                      resetEmail.includes('yahoo') ? 'https://mail.yahoo.com' :
                      resetEmail.includes('outlook') || resetEmail.includes('hotmail') ? 'https://outlook.live.com' :
                      'mailto:'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors mb-3"
                  >
                    <Mail className="w-4 h-4" />
                    Open Email App
                  </a>

                  {/* Resend */}
                  <Button
                    onClick={handleResendResetEmail}
                    disabled={resendCountdown > 0 || sendingReset}
                    variant="outline"
                    className="w-full mb-3"
                  >
                    {sendingReset ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                    ) : resendCountdown > 0 ? (
                      <><Clock className="w-4 h-4 mr-2" /> Resend in {resendCountdown}s</>
                    ) : (
                      'Resend Email'
                    )}
                  </Button>

                  {/* Didn't receive hint */}
                  <p className="text-xs text-gray-400 mt-2">
                    Didn't receive the email? Check your spam folder,<br />
                    or try with a different email address.
                  </p>
                  <button
                    onClick={() => setResetEmailSent(false)}
                    className="text-xs text-blue-600 hover:underline mt-2"
                  >
                    Try another email address
                  </button>
                </div>
              ) : (
                /* ── Step 1: Enter Email ── */
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Key className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Reset Password</h3>
                      <p className="text-sm text-gray-500">We'll send a reset link to your email</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-5">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSendResetEmail}
                      disabled={sendingReset || !resetEmail}
                      className="w-full py-3 h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      {sendingReset ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>

                  {/* Google sign-in notice */}
                  <div className="mt-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs text-amber-800 flex items-start gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Signed up with Google?</strong> Your password is managed by Google.
                        You can still set a password here to use email sign-in as an alternative.
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Change Email */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Change Email</h3>
                  <p className="text-sm text-gray-500">Current: {user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Enter new email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password (for verification)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleChangeEmail}
                  disabled={changingEmail || !newEmail || !emailPassword}
                  className="w-full py-3 h-12 rounded-xl bg-green-600 hover:bg-green-700"
                >
                  {changingEmail ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...</> : 'Update Email'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── LOGIN HISTORY ───────────────────── */}
        {activeTab === 'login-history' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-semibold text-gray-900 mb-4">Login History</h3>

            <div className="space-y-2">
              {loginHistory.length > 0 ? loginHistory.map((entry) => (
                <div key={entry.id} className={`bg-white rounded-xl shadow-sm border p-4 ${entry.isSuspicious ? 'border-red-200' : entry.status === 'failed' ? 'border-amber-200' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      entry.status === 'success' ? 'bg-green-50 text-green-600' :
                      entry.status === 'failed' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {entry.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                       entry.status === 'failed' ? <XCircle className="w-4 h-4" /> :
                       <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 capitalize">{entry.status} login</p>
                        {entry.isSuspicious && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Suspicious
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {entry.method} &middot; {entry.browser} on {entry.os}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.timestamp)}</p>
                      {entry.suspiciousReason && (
                        <p className="text-xs text-red-500 mt-1">{entry.suspiciousReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No login history yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── ACCOUNT SETTINGS ────────────────── */}
        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{userProfile?.role || 'User'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${user?.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {user?.emailVerified ? <><CheckCircle2 className="w-4 h-4" /> Verified</> : <><AlertCircle className="w-4 h-4" /> Not Verified</>}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${settings?.phoneVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    {settings?.phoneVerified ? <><CheckCircle2 className="w-4 h-4" /> Verified</> : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">2FA</span>
                  <span className="text-sm font-medium text-gray-400">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-5">
              <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-xs text-gray-500 mb-4">
                Deleting your account will remove all your data, orders, wallet balance, and rewards permanently after a 30-day grace period.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <UserX className="w-4 h-4 mr-2" /> Delete Account
                </Button>
              ) : (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-3">Are you absolutely sure?</p>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Optional: Tell us why you're leaving..."
                    className="w-full p-3 border border-red-200 rounded-lg text-sm resize-none h-20 focus:ring-2 focus:ring-red-400 outline-none mb-3"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={actionLoading === 'delete'}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {actionLoading === 'delete' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      Delete My Account
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="hidden lg:block"><Footer /></div>
      <div className="lg:hidden"><MobileBottomNav /></div>
    </div>
  );
};

export default SecurityPage;
