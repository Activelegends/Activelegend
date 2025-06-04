import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiUser, HiLogout, HiShieldCheck, HiUserGroup, HiTrash } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();
  if (!user) return null;

  const avatar = user.user_metadata?.avatar_url || null;

  return (
    <Menu as="div" className="relative inline-block text-right">
      {/* دکمهٔ آواتار / آیکون */}
      <Menu.Button className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/10 text-white hover:bg-white/20 transition-colors">
        {avatar ? (
          <img
            src={avatar}
            alt="User avatar"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/fallback-avatar.png';
            }}
          />
        ) : (
          <HiUser className="w-5 h-5" title="پروفایل" />
        )}
      </Menu.Button>

      {/* منوی کشویی */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="
            absolute right-0 mt-2 
            w-[240px]       /* عرض ثابت برای دسکتاپ */
            max-w-[90vw]    /* محدودیت عرض برای موبایل */
            origin-top-right 
            rounded-md 
            bg-black 
            border border-white/10 
            shadow-lg 
            focus:outline-none 
            z-50 
            overflow-hidden
          "
        >
          <div className="p-2">
            {/* بخش ایمیل یا نام کاربر */}
            <div className="px-3 py-2 text-sm text-gray-300 flex items-center gap-2 w-full">
              <span className="truncate flex-1 min-w-0 overflow-hidden text-ellipsis">
                {user.user_metadata?.full_name || user.email}
              </span>
              {isAdmin && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                  مدیر
                </span>
              )}
            </div>

            {/* گزینه‌های مدیریت (در صورت ادمین بودن) */}
            {isAdmin && (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => console.log('مدیریت کاربران')}
                      className={`${
                        active ? 'bg-white/10' : ''
                      } group flex w-full items-center rounded-md px-3 py-2 text-sm text-white gap-2`}
                    >
                      <HiUserGroup className="w-5 h-5" />
                      مدیریت کاربران
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => console.log('مدیریت نظرات')}
                      className={`${
                        active ? 'bg-white/10' : ''
                      } group flex w-full items-center rounded-md px-3 py-2 text-sm text-white gap-2`}
                    >
                      <HiShieldCheck className="w-5 h-5" />
                      مدیریت نظرات
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => console.log('حذف محتوا')}
                      className={`${
                        active ? 'bg-white/10' : ''
                      } group flex w-full items-center rounded-md px-3 py-2 text-sm text-white gap-2`}
                    >
                      <HiTrash className="w-5 h-5" />
                      حذف محتوا
                    </button>
                  )}
                </Menu.Item>
                <div className="my-1 border-t border-white/10"></div>
              </>
            )}

            {/* گزینهٔ خروج */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut()}
                  className={`${
                    active ? 'bg-white/10' : ''
                  } group flex w-full items-center rounded-md px-3 py-2 text-sm text-white gap-2`}
                >
                  <HiLogout className="w-5 h-5" />
                  خروج
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
