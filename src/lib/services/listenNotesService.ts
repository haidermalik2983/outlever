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

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  description_highlighted: string;
  title_original: string;
  audio: string;
  image: string;
  thumbnail: string;
  podcast: {
    id: string;
    title: string;
    publisher: string;
  };
  audio_length_sec: number;
  pub_date_ms: number;
}

export interface SearchResponse {
  results: PodcastEpisode[];
  next_offset: number;
  count: number;
  total: number;
}

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