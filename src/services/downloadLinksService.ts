import { supabase } from '../lib/supabaseClient';

export interface DownloadLink {
  id: string;
  url: string;
  title?: string;
  created_at?: string;
}

export const downloadLinksService = {
  async getAll(): Promise<DownloadLink[]> {
    const { data, error } = await supabase.from('download_links').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getById(id: string): Promise<DownloadLink | null> {
    const { data, error } = await supabase.from('download_links').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },
  async add(link: DownloadLink): Promise<DownloadLink> {
    const { data, error } = await supabase.from('download_links').insert([link]).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, link: Partial<DownloadLink>): Promise<DownloadLink> {
    const { data, error } = await supabase.from('download_links').update(link).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('download_links').delete().eq('id', id);
    if (error) throw error;
  },
}; 