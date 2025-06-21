import { NextRequest, NextResponse } from 'next/server';
import PodcastSummary from '@/db/models/PodcastSummary';
import { getPodcastEpisode } from '@/services/listenNotesService';
import { summarizeText } from '@/services/openaiService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const podcastId = searchParams.get('id');

    if (!podcastId) {
      return NextResponse.json(
        { error: 'Podcast ID is required' },
        { status: 400 }
      );
    }

    const existingSummary = await PodcastSummary.findOne({ podcast_id: podcastId });

    if (existingSummary) {
      return NextResponse.json({ summary: existingSummary }, { status: 200 });
    }
    
    const episode = await getPodcastEpisode(podcastId);

    if (!episode.audio) {
      return NextResponse.json(
        { error: 'No audio available for this episode.' },
        { status: 400 }
      );
    }

    // 2. Summarize the transcript
    const summaryText = await summarizeText(episode.transcript);

    const newSummary = await PodcastSummary.create({
      podcast_id: podcastId,
      summary: summaryText,
    });

    return NextResponse.json({ summary: newSummary }, { status: 201 });
  } catch (error) {
    console.error('Error retrieving podcast summary:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve podcast summary' },
      { status: 500 }
    );
  }
}