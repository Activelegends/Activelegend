'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect } from 'react';

export default function SignUp() {
  const { signInWithGoogle, user } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">ثبت نام در Active Legend</h1>
        <button
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-6 h-6"
          />
          <span>ثبت نام با Google</span>
        </button>
      </div>
    </main>
  );
} 