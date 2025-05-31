export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormData {
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
} 