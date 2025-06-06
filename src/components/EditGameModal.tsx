import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import type { Game, ContentBlock } from '../types/game';

interface EditGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditGameModal: React.FC<EditGameModalProps> = ({
  game,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Game>(game);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContentBlockChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newBlocks = [...prev.content_blocks];
      newBlocks[index] = {
        ...newBlocks[index],
        [field]: value
      };
      return { ...prev, content_blocks: newBlocks };
    });
  };

  const addContentBlock = (type: 'image' | 'video' | 'text') => {
    const newBlock: ContentBlock = {
      type,
      ...(type === 'image' && { src: '', alt: '' }),
      ...(type === 'video' && { src: '', caption: '' }),
      ...(type === 'text' && { content: '' })
    };
    setFormData(prev => ({
      ...prev,
      content_blocks: [...prev.content_blocks, newBlock]
    }));
  };

  const removeContentBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.filter((_, i) => i !== index)
    }));
  };

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.content_blocks.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    setFormData(prev => {
      const newBlocks = [...prev.content_blocks];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      return { ...prev, content_blocks: newBlocks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('games')
        .update(formData)
        .eq('id', game.id);

      if (error) throw error;
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving game:', error);
      alert('خطا در ذخیره تغییرات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">ویرایش بازی</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">نامک</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">عنوان</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">توضیحات</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">آدرس آیکون</label>
                  <input
                    type="url"
                    name="image_icon"
                    value={formData.image_icon}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">آدرس دانلود</label>
                  <input
                    type="url"
                    name="download_url"
                    value={formData.download_url}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">وضعیت</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                    required
                  >
                    <option value="in_progress">در حال ساخت</option>
                    <option value="released">ساخته شده</option>
                    <option value="coming_soon">به زودی</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_visible"
                    checked={formData.is_visible}
                    onChange={handleInputChange}
                    className="ml-2"
                  />
                  <label className="text-sm font-medium text-gray-300">نمایش در سایت</label>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-white">بلوک‌های محتوا</h3>
                
                <div className="space-y-4">
                  {formData.content_blocks.map((block, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">
                          {block.type === 'image' && 'تصویر'}
                          {block.type === 'video' && 'ویدیو'}
                          {block.type === 'text' && 'متن'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => moveContentBlock(index, 'up')}
                            className="text-gray-400 hover:text-white"
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveContentBlock(index, 'down')}
                            className="text-gray-400 hover:text-white"
                            disabled={index === formData.content_blocks.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            حذف
                          </button>
                        </div>
                      </div>

                      {block.type === 'image' && (
                        <>
                          <input
                            type="url"
                            value={block.src}
                            onChange={e => handleContentBlockChange(index, 'src', e.target.value)}
                            placeholder="آدرس تصویر"
                            className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2"
                            required
                          />
                          <input
                            type="text"
                            value={block.alt}
                            onChange={e => handleContentBlockChange(index, 'alt', e.target.value)}
                            placeholder="متن جایگزین"
                            className="w-full bg-gray-700 text-white rounded-lg p-2"
                            required
                          />
                        </>
                      )}

                      {block.type === 'video' && (
                        <>
                          <input
                            type="url"
                            value={block.src}
                            onChange={e => handleContentBlockChange(index, 'src', e.target.value)}
                            placeholder="آدرس ویدیو"
                            className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2"
                            required
                          />
                          <input
                            type="text"
                            value={block.caption}
                            onChange={e => handleContentBlockChange(index, 'caption', e.target.value)}
                            placeholder="توضیحات ویدیو"
                            className="w-full bg-gray-700 text-white rounded-lg p-2"
                          />
                        </>
                      )}

                      {block.type === 'text' && (
                        <textarea
                          value={block.content}
                          onChange={e => handleContentBlockChange(index, 'content', e.target.value)}
                          placeholder="متن محتوا"
                          className="w-full bg-gray-700 text-white rounded-lg p-2 h-24"
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => addContentBlock('image')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    افزودن تصویر
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock('video')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    افزودن ویدیو
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock('text')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    افزودن متن
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#F4B744] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#E5A93D] disabled:opacity-50"
                >
                  {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditGameModal; 