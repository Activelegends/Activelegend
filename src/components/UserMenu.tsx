import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiUser, HiLogout, HiShieldCheck, HiUserGroup, HiTrash } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();

  if (!user) return null;

  return (
    <Menu as="div" className="relative inline-block text-right">
      <Menu.Button className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/10 text-white hover:bg-white/20 transition-colors">
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt="User avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <HiUser className="w-5 h-5" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-black border border-white/10 shadow-lg focus:outline-none">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="truncate">{user.email}</span>
                {isAdmin && (
                  <span className="flex-shrink-0 text-sm bg-primary/20 text-primary px-1 py-0 rounded">
                    مدیر
                  </span>
                )}
              </div>
            </div>

            {isAdmin && (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
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