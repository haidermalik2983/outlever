import { IPodcastSummary } from '@/lib/models/PodcastSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PodcastEpisode } from '@/lib/services/listenNotesService';

interface PodcastSummaryProps {
  summary?: IPodcastSummary;
  episode?: PodcastEpisode;
  isLoading: boolean;
  error?: string;
}

export default function PodcastSummary({ summary, episode, isLoading, error }: PodcastSummaryProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">
          {episode ? `${episode.title} - Summary` : 'Podcast Summary'}
        </CardTitle>
        {episode && (
          <div className="text-sm text-gray-500">{episode.podcast.publisher}</div>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {summary.summary.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 