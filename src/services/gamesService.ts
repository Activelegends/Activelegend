import { api } from './api';
import type { Game } from '../types/game';

export const gamesService = {
  async getGames(): Promise<Game[]> {
    const response = await api.get('/games');
    return response.data;
  },

  async getGame(slug: string): Promise<Game> {
    const response = await api.get(`/games/${slug}`);
    return response.data;
  },

  async createGame(game: Omit<Game, 'id'>): Promise<Game> {
    const response = await api.post('/games', game);
    return response.data;
  },

  async updateGame(id: number, game: Partial<Game>): Promise<Game> {
    const response = await api.put(`/games/${id}`, game);
    return response.data;
  },

  async deleteGame(id: number): Promise<void> {
    await api.delete(`/games/${id}`);
  }
}; 