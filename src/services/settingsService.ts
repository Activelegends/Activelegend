import { SiteSettings } from '../types/settings';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return response.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    return response.json();
  },
}; 