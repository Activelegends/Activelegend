import { UserAvatar } from './UserAvatar';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            {/* ... existing logo and nav code ... */}
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            <UserAvatar size="medium" className="hover:opacity-80 transition-opacity" />
            {/* ... existing auth buttons ... */}
          </div>
        </div>
      </div>
    </header>
  );
} 