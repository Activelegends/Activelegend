import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import type { FieldArrayWithId } from 'react-hook-form';

interface ContentBlock {
  type: 'image' | 'video' | 'text';
  src?: string;
  alt?: string;
  caption?: string;
  content?: string;
}

interface NewGame {
  slug: string;
  title: string;
  description: string;
  image_icon: string;
  download_url: string;
  status: 'in_progress' | 'released' | 'coming_soon';
  is_visible: boolean;
  content_blocks: ContentBlock[];
}

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGame: NewGame) => Promise<void>;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<NewGame>({
    defaultValues: {
      status: 'coming_soon',
      is_visible: true,
      content_blocks: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'content_blocks',
  });

  const onSubmit = async (data: NewGame) => {
    try {
      setIsSaving(true);
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving game:', error);
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
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">افزودن بازی جدید</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    اسلاگ
                  </label>
                  <input
                    {...register('slug', { required: true })}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    عنوان
                  </label>
                  <input
                    {...register('title', { required: true })}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  توضیحات
                </label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full bg-gray-800 text-white rounded-lg p-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    آدرس آیکون
                  </label>
                  <input
                    {...register('image_icon', { required: true })}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    آدرس دانلود
                  </label>
                  <input
                    {...register('download_url', { required: true })}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    وضعیت
                  </label>
                  <select
                    {...register('status', { required: true })}
                    className="w-full bg-gray-800 text-white rounded-lg p-2"
                  >
                    <option value="in_progress">در حال ساخت</option>
                    <option value="released">ساخته شده</option>
                    <option value="coming_soon">به زودی</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      {...register('is_visible')}
                      className="ml-2"
                    />
                    قابل مشاهده
                  </label>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">بلوک‌های محتوا</h3>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => append({ type: 'image', src: '', alt: '' })}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      افزودن تصویر
                    </button>
                    <button
                      type="button"
                      onClick={() => append({ type: 'video', src: '', caption: '' })}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      افزودن ویدیو
                    </button>
                    <button
                      type="button"
                      onClick={() => append({ type: 'text', content: '' })}
                      className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      افزودن متن
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {fields.map((field: FieldArrayWithId<NewGame, 'content_blocks'>, index: number) => (
                    <div key={field.id} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <select
                          {...register(`content_blocks.${index}.type`)}
                          className="bg-gray-700 text-white rounded-lg p-2"
                        >
                          <option value="image">تصویر</option>
                          <option value="video">ویدیو</option>
                          <option value="text">متن</option>
                        </select>
                        <div className="space-x-2">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => move(index, index - 1)}
                              className="text-gray-300 hover:text-white"
                            >
                              ↑
                            </button>
                          )}
                          {index < fields.length - 1 && (
                            <button
                              type="button"
                              onClick={() => move(index, index + 1)}
                              className="text-gray-300 hover:text-white"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            حذف
                          </button>
                        </div>
                      </div>

                      {field.type === 'image' && (
                        <>
                          <input
                            {...register(`content_blocks.${index}.src`)}
                            placeholder="آدرس تصویر"
                            className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2"
                          />
                          <input
                            {...register(`content_blocks.${index}.alt`)}
                            placeholder="متن جایگزین"
                            className="w-full bg-gray-700 text-white rounded-lg p-2"
                          />
                        </>
                      )}

                      {field.type === 'video' && (
                        <>
                          <input
                            {...register(`content_blocks.${index}.src`)}
                            placeholder="آدرس ویدیو"
                            className="w-full bg-gray-700 text-white rounded-lg p-2 mb-2"
                          />
                          <input
                            {...register(`content_blocks.${index}.caption`)}
                            placeholder="عنوان ویدیو"
                            className="w-full bg-gray-700 text-white rounded-lg p-2"
                          />
                        </>
                      )}

                      {field.type === 'text' && (
                        <textarea
                          {...register(`content_blocks.${index}.content`)}
                          placeholder="متن"
                          className="w-full bg-gray-700 text-white rounded-lg p-2"
                          rows={3}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#F4B744] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#E5A93D] disabled:opacity-50"
                >
                  {isSaving ? 'در حال ذخیره...' : 'افزودن بازی'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 