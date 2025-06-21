import { PodcastEpisode } from '@/types';
import axios from 'axios';

const LISTEN_NOTES_API_KEY = process.env.LISTEN_NOTES_API_KEY;
const BASE_URL = 'https://listen-api-test.listennotes.com/api/v2';

// Create an axios instance with the API key
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-ListenAPI-Key': LISTEN_NOTES_API_KEY,
  },
});

export async function searchPodcasts(query: string, limit = 10, page = 1): Promise<PodcastEpisode[]> {
  try {
    const response = await api.get('/search', {
      params: {
        q: query,
        type: 'episode',
        language: 'English',
        safe_mode: 1,
        page_size: limit,
        offset: (page - 1) * limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching podcasts:', error);
    throw new Error('Failed to search podcasts');
  }
}

/**
 * Get a specific podcast episode by ID
 */
export async function getPodcastEpisode(id: string): Promise<PodcastEpisode> {
  try {
    const response = await api.get(`/episodes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast episode:', error);
    throw new Error('Failed to fetch podcast episode');
  }
}