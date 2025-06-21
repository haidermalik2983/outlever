'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import PodcastCard from '@/components/podcast-card/PodcastCard';
import CardSkeleton from '@/components/podcast-card/CardSkeleton';
import PodcastSummary from '@/components/podcast-summary/PodcastSummary';
import { IPodcastSummary } from '@/db/models/PodcastSummary';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PodcastEpisode, PodcastsResponse } from '@/types';

export default function Home() {
  const [podcasts, setPodcasts] = useState<PodcastsResponse | null>(null);
  const [isLoadingPodcasts, setIsLoadingPodcasts] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summary, setSummary] = useState<IPodcastSummary | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [page, setPage] = useState(1);

  const getPodcasts = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch podcasts');
    }
    const data = await response.json();
    return data;
  };

  const fetchPodcasts = useCallback(async () => {
    try {
      setIsLoadingPodcasts(true);
      setPage(1);
      
      const url = `/api/podcasts?page=${page}`;
      
      const data = await getPodcasts(url);
      
      setPodcasts(data.podcasts);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch podcasts';
      toast.error(errorMessage);
    } finally {
      setIsLoadingPodcasts(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  const fetchMoreData = async () => {
    setIsLoadingPodcasts(true);
    setPage(page + 1);

    const url = `/api/podcasts?page=${page + 1}`;
    const data = await getPodcasts(url);

    setIsLoadingPodcasts(false);
    setPodcasts((prev: PodcastsResponse | null) => 
      prev ? ({
        ...prev,
        results: [...prev.results, ...data.podcasts.results],
      }) 
      : null
    );
  };

  const handleSummarize = async (episode: PodcastEpisode) => {
    try {
      setIsLoadingSummary(true);
      setSelectedEpisodeId(episode.id);
      setSelectedEpisode(episode);
      
      const checkResponse = await fetch(`/api/summary?id=${episode.id}`);
      
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        setSummary(data.summary);
        return;
      }

      toast.success('Summary generated successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
      toast.error(errorMessage);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Outlever Podcast Summarizer</h1>
      <p className="text-gray-600 mb-6">
        Discover podcasts and get AI-generated summaries
      </p>
      
      {summary ? (
        <div className=''>
            <button 
              onClick={() => setSummary(null)} 
              className="cursor-pointer text-blue-600 hover:text-blue-800 underline mb-4 inline-block"
            >
              ← Back to podcasts
            </button>
            <PodcastSummary 
              summary={summary} 
              episode={selectedEpisode || undefined}
            />
        </div>
      ):(
        <>
          <h2 className="text-2xl font-bold mb-4">
            Podcasts
          </h2>
          
          {isLoadingPodcasts && page === 1 ? (
            <CardSkeleton />
          ) : (
            <InfiniteScroll
              dataLength={podcasts?.results.length || 0}
              next={fetchMoreData}
              hasMore={!!(podcasts && (podcasts.count < podcasts.total))}
              loader={
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              }
              endMessage={
                <p className="text-center text-gray-500 py-4">
                  {podcasts && podcasts.results.length > 0 ? "You've seen all podcasts" : ""}
                </p>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts?.results.map((episode, index) => (
                  <PodcastCard
                    key={index}
                    episode={episode}
                    onSummarize={handleSummarize}
                    isLoading={isLoadingSummary && selectedEpisodeId === episode.id}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}
      
      {!isLoadingPodcasts && podcasts?.results.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No podcasts found. Try a different search term.
        </p>
      )}
    </main>
  );
}
