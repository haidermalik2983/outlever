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
    rss: string;
    transcript: string;
  }
  
  export interface SearchResponse {
    results: PodcastEpisode[];
    next_offset: number;
    count: number;
    total: number;
  }

export interface PodcastsResponse {
    count: number;
    total: number;
    results: PodcastEpisode[];
}