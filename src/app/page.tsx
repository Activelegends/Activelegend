'use client';

import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Active Legend</h1>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {user ? (
              <>
                <span className="text-gray-600">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  خروج
                </button>
              </>
            ) : (
              <a
                href="/auth/signin"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ورود
              </a>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">به Active Legend خوش آمدید!</h2>
          <p className="text-gray-600 mb-4">
            اینجا می‌توانید با دیگر بازیکنان در ارتباط باشید و تجربیات خود را به اشتراک بگذارید.
          </p>
          {!user && (
            <div className="text-center">
              <a
                href="/auth/signup"
                className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                ثبت نام کنید
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 