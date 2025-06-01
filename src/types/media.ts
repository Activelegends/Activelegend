export interface MediaItem {
  media_id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaFormData {
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
} 