export interface Game {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface GameFormData {
  slug: string;
  title: string;
  description: string;
  image_icon: string;
  image_gallery: string[];
  video_urls: string[];
  download_url: string;
  is_visible: boolean;
} 