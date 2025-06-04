import { UserAvatar } from './UserAvatar';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
  };
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <UserAvatar size="small" showName={false} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <UserAvatar size="small" showName={true} />
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleDateString('fa-IR')}
          </span>
        </div>
        <p className="text-gray-700">{comment.content}</p>
      </div>
    </div>
  );
} 