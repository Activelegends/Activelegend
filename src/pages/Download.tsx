import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { downloadLinksService } from '../services/downloadLinksService';
import type { DownloadLink } from '../services/downloadLinksService';

const AD_BANNER = (
  <div id="pos-article-display-108440"></div>
);

export default function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [count, setCount] = useState(10);
  const [notFound, setNotFound] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<DownloadLink | null>(null);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    setLink(null);
    downloadLinksService.getById(id).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setLink(data);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!link) return;
    setCount(10);
    setReady(false);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setReady(true);
          // window.location.href = link.url;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [link]);

  const handleDownload = () => {
    if (link?.url) {
      window.location.href = link.url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
        <div className="bg-white/10 border border-primary/40 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-lg text-primary font-bold mb-4">در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-white mb-2 text-center">دانلود فایل</h1>
        {link?.title && <div className="text-primary text-lg font-bold mb-4 text-center">{link.title}</div>}
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