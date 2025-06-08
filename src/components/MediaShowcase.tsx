import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import type { MediaItem, MediaFormData } from '../types/media';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaPlay, FaPause } from 'react-icons/fa';
import React from 'react';
import { supabase } from '../supabaseClient';

interface AparatVideoInfo {
  uid: string;
  title: string;
  small_poster: string;
  big_poster: string;
}

interface MediaFormProps {
  onSubmit: (formData: MediaFormData) => void;
  onClose: () => void;
  initialData?: MediaFormData;
  isEditing?: boolean;
}

const MediaForm = React.memo(({ onSubmit, onClose, initialData, isEditing }: MediaFormProps) => {
  const [formData, setFormData] = useState<MediaFormData>(initialData || {
    type: 'image',
    url: '',
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-white text-center">
          {isEditing ? 'ویرایش آیتم' : 'افزودن به ویترین'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-right">نوع محتوا</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'image' | 'video' }))}
              className="w-full bg-gray-800 text-white rounded p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="image">تصویر</option>
              <option value="video">ویدیو</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-right">آدرس</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full bg-gray-800 text-white rounded p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder={formData.type === 'image' ? 'آدرس تصویر' : 'آدرس ویدیو (YouTube یا Vimeo)'}
              dir="ltr"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-right">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-800 text-white rounded p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="عنوان به فارسی"
              dir="rtl"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-right">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 text-white rounded p-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
              rows={3}
              placeholder="توضیحات به فارسی"
              dir="rtl"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
            >
              {isEditing ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default function MediaShowcase() {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [videoPreviews, setVideoPreviews] = useState<{ [key: string]: AparatVideoInfo }>({});
  const controls = useAnimation();
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState<MediaFormData>({
    type: 'image',
    url: '',
    title: '',
    description: ''
  });

  const isAdmin = user?.email === 'active.legendss@gmail.com';

  const fetchAparatVideoInfo = async (url: string) => {
    try {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (!videoId) return null;

      const response = await fetch(`https://www.aparat.com/etc/api/video/videohash/${videoId}`);
      const data = await response.json();
      
      if (data.video) {
        return {
          uid: data.video.uid,
          title: data.video.title,
          small_poster: data.video.small_poster,
          big_poster: data.video.big_poster
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Aparat video info:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        console.log('Fetched media items:', data);
        setMediaItems(data);
        
        // دریافت اطلاعات ویدیوهای آپارات
        data.forEach(async (item: MediaItem) => {
          if (item.type === 'video' && item.url.includes('aparat.com')) {
            const videoInfo = await fetchAparatVideoInfo(item.url);
            if (videoInfo) {
              setVideoPreviews(prev => ({
                ...prev,
                [item.id]: videoInfo
              }));
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching media items:', error);
      alert('خطا در دریافت اطلاعات ویترین. لطفاً صفحه را رفرش کنید.');
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleVideoPlay = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      if (playingVideos.has(id)) {
        video.pause();
        setPlayingVideos(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        // توقف تمام ویدیوهای دیگر
        playingVideos.forEach(playingId => {
          const playingVideo = videoRefs.current[playingId];
          if (playingVideo) {
            playingVideo.pause();
          }
        });
        setPlayingVideos(new Set([id]));
        
        // پخش ویدیو جدید
        video.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
    }
  };

  const handleAdd = () => {
    setFormData({ type: 'image', url: '', title: '', description: '' });
    setEditingItem(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ type: 'image', url: '', title: '', description: '' });
  };

  const handleEdit = (item: MediaItem) => {
    setFormData({
      type: item.type,
      url: item.url,
      title: item.title,
      description: item.description
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    try {
      if (editingItem) {
        console.log('Updating item:', editingItem.id);
        const { data, error } = await supabase
          .from('media_gallery')
          .update({
            type: formData.type,
            url: formData.url,
            title: formData.title,
            description: formData.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Update successful:', data);
      } else {
        console.log('Inserting new item');
        const { data, error } = await supabase
          .from('media_gallery')
          .insert([{
            type: formData.type,
            url: formData.url,
            title: formData.title,
            description: formData.description,
            is_visible: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Insert successful:', data);
      }
      
      handleCloseModal();
      await fetchMediaItems();
    } catch (error) {
      console.error('Error saving media item:', error);
      alert('خطا در ذخیره اطلاعات ویترین. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleInputChange = (field: keyof MediaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آیتم از ویترین اطمینان دارید؟')) {
      return;
    }
    
    try {
      console.log('Deleting media with ID:', id);
      
      const { data, error } = await supabase
        .from('media_gallery')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Delete response:', data);
      await fetchMediaItems();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      alert('خطا در حذف آیتم از ویترین. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    if (!id) {
      console.error('Media ID is undefined');
      return;
    }

    try {
      console.log('Toggling visibility for ID:', id, 'Current visibility:', currentVisibility);
      
      const { data, error } = await supabase
        .from('media_gallery')
        .update({ is_visible: !currentVisibility })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Update response:', data);
      await fetchMediaItems();
    } catch (error) {
      console.error('Error in handleToggleVisibility:', error);
      alert('خطا در تغییر وضعیت نمایش ویترین. لطفاً دوباره تلاش کنید.');
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com')
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes('aparat.com')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      return `https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`;
    }
    return url;
  };

  const getImageUrl = (url: string) => {
    try {
      // تبدیل لینک وان‌درایو
      if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) {
        // تبدیل لینک اشتراک‌گذاری به لینک مستقیم
        const downloadUrl = url.replace('redir?', 'download?');
        return downloadUrl.includes('?') ? `${downloadUrl}&download=1` : `${downloadUrl}?download=1`;
      }
      
      // تبدیل لینک گوگل درایو
      if (url.includes('drive.google.com')) {
        // استخراج ID فایل از لینک
        let fileId = '';
        if (url.includes('/d/')) {
          fileId = url.split('/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
          fileId = url.split('id=')[1].split('&')[0];
        } else {
          const match = url.match(/[-\w]{25,}/);
          if (match) fileId = match[0];
        }
        
        if (fileId) {
          // استفاده از API گوگل درایو برای نمایش تصویر
          return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
      }
      
      return url;
    } catch (error) {
      console.error('Error parsing image URL:', error);
      return url;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const originalSrc = target.src;
    
    // اگر لینک گوگل درایو است، سعی کن با روش دیگری لود کنی
    if (originalSrc.includes('drive.google.com')) {
      const fileId = originalSrc.split('id=')[1]?.split('&')[0];
      if (fileId) {
        target.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return;
      }
    }
    
    // اگر لینک وان‌درایو است، سعی کن با روش دیگری لود کنی
    if (originalSrc.includes('onedrive.live.com') || originalSrc.includes('1drv.ms')) {
      const downloadUrl = originalSrc.replace('download?', 'redir?');
      target.src = downloadUrl;
      return;
    }
    
    // اگر هیچ کدام کار نکرد، از لوگوی موجود استفاده کن
    target.src = '/AE-logo.png';
  };

  // فیلتر کردن آیتم‌ها برای نمایش
  const visibleItems = isAdmin ? mediaItems : mediaItems.filter(item => item.is_visible);

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={containerVariants}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">ویترین</h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            مجموعه‌ای از بهترین آثار و پروژه‌های ما
          </p>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
            className="flex justify-end mb-8"
          >
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
            >
              <FaPlus />
              <span>افزودن به ویترین</span>
            </button>
          </motion.div>
        )}

        {visibleItems.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center text-gray-400 py-12 text-xl sm:text-2xl"
          >
            {isAdmin ? 'هیچ آیتمی در ویترین وجود ندارد' : 'در حال حاضر هیچ آیتمی در ویترین برای نمایش وجود ندارد'}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 scroll-container"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            <AnimatePresence mode="sync">
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="relative group"
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    {item.type === 'image' ? (
                      <img
                        src={getImageUrl(item.url)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <iframe
                          src={getEmbedUrl(item.url)}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    )}
                    
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors duration-200"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(item.id, item.is_visible)}
                          className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors duration-200"
                        >
                          {item.is_visible ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-700"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-white text-center">
              {editingItem ? 'ویرایش آیتم' : 'افزودن به ویترین'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-3 text-right text-base sm:text-lg">نوع محتوا</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 sm:p-4 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base sm:text-lg"
                >
                  <option value="image">تصویر</option>
                  <option value="video">ویدیو</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-3 text-right text-base sm:text-lg">آدرس</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 sm:p-4 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base sm:text-lg"
                  placeholder={formData.type === 'image' ? 'آدرس تصویر' : 'آدرس ویدیو (YouTube یا Vimeo)'}
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-3 text-right text-base sm:text-lg">عنوان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 sm:p-4 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base sm:text-lg"
                  placeholder="عنوان به فارسی"
                  dir="rtl"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-3 text-right text-base sm:text-lg">توضیحات</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 sm:p-4 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base sm:text-lg resize-none"
                  rows={3}
                  placeholder="توضیحات به فارسی"
                  dir="rtl"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
                >
                  {editingItem ? 'ویرایش' : 'افزودن'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
} 