'use client';

import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
// import SearchBar from '@/components/SearchBar';
import PodcastCard from '@/components/PodcastCard';
import PodcastSummary from '@/components/PodcastSummary';
import { PodcastEpisode } from '@/lib/services/listenNotesService';
import { IPodcastSummary } from '@/lib/models/PodcastSummary';
import { Skeleton } from '@/components/ui/skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const [podcasts, setPodcasts] = useState<{
    count: number;
    total: number;
    results: PodcastEpisode[];
  } | null>(null);
  const [isLoadingPodcasts, setIsLoadingPodcasts] = useState(true);
  const [, setIsLoadingSearch] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summary, setSummary] = useState<IPodcastSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const getPodcasts = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch podcasts');
    }
    const data = await response.json();
    return data;
  };

  const fetchPodcasts = async (query?: string, reset = true) => {
    try {
      if (query) {
        setIsLoadingSearch(true);
        if (reset) {
          setSearchQuery(query);
          setPage(1);
        }
      } else {
        setIsLoadingPodcasts(true);
        if (reset) {
          setSearchQuery('');
          setPage(1);
        }
      }
      
      const currentQuery = reset ? query : searchQuery;
      const currentPage = reset ? 1 : page;
      
      const url = currentQuery 
        ? `/api/podcasts?query=${encodeURIComponent(currentQuery)}&page=${currentPage}`
        : `/api/podcasts?page=${currentPage}`;
      
      const data = await getPodcasts(url);
      
      if (reset) {
        setPodcasts(data.podcasts);
      } else {
        setPodcasts(data.podcasts);
      }
      
      setHasMore(data.podcasts.length > 0);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast.error('Failed to fetch podcasts');
    } finally {
      setIsLoadingPodcasts(false);
      setIsLoadingSearch(false);
    }
  };

  const fetchMoreData = async () => {
    setIsLoadingPodcasts(true);
    setPage(page + 1);
    const url = `/api/podcasts?page=${page + 1}`;
    const data = await getPodcasts(url);
    setIsLoadingPodcasts(false);
    setPodcasts((prev: any) => ({
      ...prev,
      results: [...prev.results, ...data.podcasts.results],
    }));
  };

  const handleSummarize = async (episode: PodcastEpisode) => {
    try {
      setIsLoadingSummary(true);
      setSelectedEpisodeId(episode.id);
      setSelectedEpisode(episode);
      setError(null);
      
      const checkResponse = await fetch(`/api/summary?id=${episode.id}`);
      
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        setSummary(data.summary);
        return;
      }
      
      const generateResponse = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ podcastId: episode.id }),
      });
      
      if (!generateResponse.ok) {
        throw new Error('Failed to generate summary');
      }
      
      const data = await generateResponse.json();
      setSummary(data.summary);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
      toast.error('Failed to generate summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="h-[400px]">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-2">Outlever Podcast Summarizer</h1>
      <p className="text-gray-600 mb-6">
        Discover podcasts and get AI-generated summaries
      </p>
      
      {/* <SearchBar onSearch={handleSearch} isLoading={isLoadingSearch} /> */}
      
      {summary && (
        <PodcastSummary 
          summary={summary} 
          episode={selectedEpisode || undefined}
          isLoading={isLoadingSummary} 
          error={error || undefined} 
        />
      )}
      
      <h2 className="text-2xl font-bold mb-4">
        Podcasts
      </h2>
      
      {isLoadingPodcasts && page === 1 ? (
        renderSkeletons()
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
      
      {!isLoadingPodcasts && podcasts?.results.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No podcasts found. Try a different search term.
        </p>
      )}
    </main>
  );
}
