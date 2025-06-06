export type GameStatus = 'in_progress' | 'released' | 'coming_soon';

export interface ContentBlock {
  type: 'image' | 'video' | 'text';
  src?: string;
  alt?: string;
  caption?: string;
  content?: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_icon: string;
  download_url: string;
  status: GameStatus;
  is_visible: boolean;
  content_blocks: ContentBlock[];
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

export type NewGame = Omit<Game, 'id' | 'created_at' | 'updated_at'>; 