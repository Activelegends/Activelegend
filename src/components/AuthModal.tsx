import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp, signInWithGoogle } = useAuth();

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      if (err.message.includes('over_email_send_rate_limit')) {
        setError('تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید و دوباره تلاش کنید.');
      } else if (err.message.includes('invalid_credentials')) {
        setError('ایمیل یا رمز عبور اشتباه است.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('لطفاً ایمیل خود را تایید کنید.');
      } else {
        setError('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
      }
    } else {
      setError('خطایی رخ داد');
    }
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('لطفاً یک ایمیل معتبر وارد کنید.');
      return false;
    }
    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err) {
      handleError(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-black p-6 text-right shadow-xl border border-white/10"
            >
              <Dialog.Title className="text-2xl font-bold text-white mb-4">
                {isLogin ? 'ورود به حساب کاربری' : 'ثبت‌نام'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white focus:border-primary focus:ring-primary"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white focus:border-primary focus:ring-primary"
                    dir="ltr"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  {isLogin ? 'ورود' : 'ثبت‌نام'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-black">یا</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>ورود با گوگل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-sm text-gray-400 hover:text-white"
                >
                  {isLogin ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}