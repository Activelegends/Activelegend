interface AparatVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
}

interface AparatResponse {
  videos: AparatVideo[];
  total: number;
  page: number;
  perPage: number;
}

const APARAT_API_URL = 'https://www.aparat.com/api/video/video/list/videohash';

export const aparatApi = {
  async getVideos(page: number = 1, perPage: number = 12): Promise<AparatResponse> {
    const response = await fetch(`${APARAT_API_URL}?page=${page}&perPage=${perPage}`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos from Aparat');
    }
    return response.json();
  },

  async searchVideos(query: string, page: number = 1, perPage: number = 12): Promise<AparatResponse> {
    const response = await fetch(
      `${APARAT_API_URL}?search=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Failed to search videos on Aparat');
    }
    return response.json();
  },
}; 