export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_icon: string;
  image_gallery: string[];
  video_urls: string[];
  download_url: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
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