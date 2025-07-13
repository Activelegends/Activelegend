import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// نمونه lookup داخلی برای id → url
const DOWNLOAD_LINKS: Record<string, string> = {
  'game1': 'https://example.com/game1.apk',
  'game2': 'https://example.com/game2.zip',
  // ... سایر لینک‌ها
};

const AD_BANNER = (
  <div className="w-full flex justify-center items-center bg-gradient-to-r from-primary/10 to-black/30 rounded-xl border border-primary/20 p-4 my-6 min-h-[80px]">
    {/* اینجا می‌توانید iframe تبلیغاتی یا بنر دلخواه قرار دهید */}
    <span className="text-primary font-bold text-lg">بنر تبلیغاتی</span>
  </div>
);

export default function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [count, setCount] = useState(10);
  const [notFound, setNotFound] = useState(false);
  const [ready, setReady] = useState(false);
  const downloadUrl = id ? DOWNLOAD_LINKS[id] : undefined;

  useEffect(() => {
    if (!id || !downloadUrl) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    setCount(10);
    setReady(false);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setReady(true);
          // Redirect directly after countdown (optional)
          // window.location.href = downloadUrl;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [id, downloadUrl]);

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
        <div className="bg-white/10 border border-red-500/40 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-3xl text-red-400 font-bold mb-4">لینک یافت نشد</div>
          <div className="text-gray-300 mb-6">آیدی وارد شده معتبر نیست یا فایل مورد نظر وجود ندارد.</div>
          <button onClick={() => navigate('/')} className="btn-primary mt-2">بازگشت به خانه</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">دانلود فایل</h1>
        {AD_BANNER}
        {!ready ? (
          <>
            <div className="text-lg text-primary font-bold mb-2">دانلود تا <span className="text-2xl">{count}</span> ثانیه دیگر آغاز می‌شود...</div>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${((10 - count) / 10) * 100}%` }}
              ></div>
            </div>
            <div className="text-gray-400 text-sm">لطفاً تا پایان شمارش صبر کنید</div>
          </>
        ) : (
          <>
            <button
              className="btn-primary w-full py-3 text-lg mt-2"
              onClick={handleDownload}
            >
              دانلود فایل
            </button>
            <div className="text-gray-400 text-xs mt-4">اگر دانلود به صورت خودکار آغاز نشد، روی دکمه بالا کلیک کنید.</div>
          </>
        )}
      </div>
    </div>
  );
} 