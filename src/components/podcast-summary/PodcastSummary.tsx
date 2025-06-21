import { IPodcastSummary } from '@/db/models/PodcastSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PodcastEpisode } from '@/types';

interface PodcastSummaryProps {
  summary: IPodcastSummary;
  episode?: PodcastEpisode;
}

export default function PodcastSummary({ summary, episode }: PodcastSummaryProps) {

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">
          {episode ? `${episode.title_original} - Summary` : 'Podcast Summary'}
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