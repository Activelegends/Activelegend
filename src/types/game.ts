export interface Game {
  id: string;
  title: string;
  description: string;
  image_url: string;
  download_url: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameFormData {
  title: string;
  description: string;
  image_url: string;
  download_url: string;
  is_visible: boolean;
} 