import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PodcastEpisode } from '@/types';

interface PodcastCardProps {
  episode: PodcastEpisode;
  onSummarize: (episode: PodcastEpisode) => void;
  isLoading?: boolean;
}

export default function PodcastCard({ episode, onSummarize, isLoading = false }: PodcastCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Format the publication date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={episode.thumbnail || episode.image}
          alt={episode.title_original}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-500">
            {formatDate(episode.pub_date_ms)}
          </div>
          <div className="text-sm text-gray-500">
            {formatDuration(episode.audio_length_sec)}
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{episode.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{episode.podcast.publisher}</p>
        <p className="text-sm line-clamp-3">{episode.description_highlighted.replace(/<[^>]*>?/gm, '')}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onSummarize(episode)} 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </Button>
      </CardFooter>
    </Card>
  );
} 