import React, { useEffect, useState } from 'react';
import type { SiteSettings } from '../types/settings';
import { settingsService } from '../services/settingsService';

export const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات سایت');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = <K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleNestedChange = <K extends keyof SiteSettings, N extends keyof NonNullable<SiteSettings[K]>>(
    section: K,
    field: N,
    value: any
  ) => {
    if (!settings) return;
    const sectionValue = settings[section] ?? {};
    setSettings({
      ...settings,
      [section]: {
        ...(typeof sectionValue === 'object' ? sectionValue : {}),
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    try {
      await settingsService.updateSettings(settings);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="bg-white/10 rounded-xl p-8 text-center text-white shadow-lg w-full max-w-md mx-auto">
        در حال بارگذاری تنظیمات سایت...
      </div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="bg-red-900/80 rounded-xl p-8 text-center text-red-200 shadow-lg w-full max-w-md mx-auto">
        {error}
      </div>
    </div>
  );
  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 pt-24">
      <div className="bg-white/10 rounded-2xl shadow-lg p-8 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">تنظیمات سایت</h1>
        {/* اطلاعات سایت */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-primary mb-4">اطلاعات سایت</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-300 mb-1">عنوان سایت</label>
              <input
                type="text"
                id="title"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.title}
                onChange={e => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="logo" className="block text-gray-300 mb-1">آدرس لوگو</label>
              <input
                type="text"
                id="logo"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.logo}
                onChange={e => handleChange('logo', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-gray-300 mb-1">توضیحات سایت</label>
              <textarea
                id="description"
                className="w-full bg-black/30 border border-white/10 text-white min-h-[60px]"
                value={settings.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* شبکه‌های اجتماعی */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-primary mb-4">شبکه‌های اجتماعی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="instagram" className="block text-gray-300 mb-1">اینستاگرام</label>
              <input
                type="text"
                id="instagram"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.socialMedia.instagram || ''}
                onChange={e => handleNestedChange('socialMedia', 'instagram', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telegram" className="block text-gray-300 mb-1">تلگرام</label>
              <input
                type="text"
                id="telegram"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.socialMedia.telegram || ''}
                onChange={e => handleNestedChange('socialMedia', 'telegram', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="youtube" className="block text-gray-300 mb-1">یوتیوب</label>
              <input
                type="text"
                id="youtube"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.socialMedia.youtube || ''}
                onChange={e => handleNestedChange('socialMedia', 'youtube', e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* اطلاعات تماس */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-primary mb-4">اطلاعات تماس</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-1">ایمیل</label>
              <input
                type="email"
                id="email"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.contactInfo.email || ''}
                onChange={e => handleNestedChange('contactInfo', 'email', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-300 mb-1">تلفن</label>
              <input
                type="text"
                id="phone"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.contactInfo.phone || ''}
                onChange={e => handleNestedChange('contactInfo', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-300 mb-1">آدرس</label>
              <input
                type="text"
                id="address"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.contactInfo.address || ''}
                onChange={e => handleNestedChange('contactInfo', 'address', e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* تنظیمات ظاهری */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-primary mb-4">تنظیمات ظاهری</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="primaryColor" className="block text-gray-300 mb-1">رنگ اصلی</label>
              <input
                type="color"
                id="primaryColor"
                className="w-full h-10 bg-black/30 border border-white/10"
                value={settings.theme.primaryColor}
                onChange={e => handleNestedChange('theme', 'primaryColor', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="secondaryColor" className="block text-gray-300 mb-1">رنگ ثانویه</label>
              <input
                type="color"
                id="secondaryColor"
                className="w-full h-10 bg-black/30 border border-white/10"
                value={settings.theme.secondaryColor}
                onChange={e => handleNestedChange('theme', 'secondaryColor', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fontFamily" className="block text-gray-300 mb-1">فونت</label>
              <input
                type="text"
                id="fontFamily"
                className="w-full bg-black/30 border border-white/10 text-white"
                value={settings.theme.fontFamily}
                onChange={e => handleNestedChange('theme', 'fontFamily', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            className="btn-primary min-w-[120px] flex items-center justify-center gap-2 disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
            type="button"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </div>
        {success && (
          <div className="text-green-400 text-center mt-4">تنظیمات با موفقیت ذخیره شد.</div>
        )}
      </div>
    </div>
  );
}; 