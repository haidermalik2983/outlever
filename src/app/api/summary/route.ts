import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import PodcastSummary from '@/lib/models/PodcastSummary';
import { getPodcastEpisode } from '@/lib/services/listenNotesService';
import { generatePodcastSummary } from '@/lib/services/geminiService';

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

    // Connect to database
    await connectToDatabase();

    // Check if summary already exists
    const existingSummary = await PodcastSummary.findOne({ podcast_id: podcastId });

    if (existingSummary) {
      return NextResponse.json({ summary: existingSummary }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Summary not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error retrieving podcast summary:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve podcast summary' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { podcastId } = body;

    if (!podcastId) {
      return NextResponse.json(
        { error: 'Podcast ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if summary already exists
    const existingSummary = await PodcastSummary.findOne({ podcast_id: podcastId });

    if (existingSummary) {
      return NextResponse.json({ summary: existingSummary }, { status: 200 });
    }

    // Fetch podcast episode details
    const episode = await getPodcastEpisode(podcastId);

    // Generate summary using Gemini
    const summaryText = await generatePodcastSummary(episode);

    // Save summary to database
    const newSummary = await PodcastSummary.create({
      podcast_id: podcastId,
      summary: summaryText,
    });

    return NextResponse.json({ summary: newSummary }, { status: 201 });
  } catch (error) {
    console.error('Error generating podcast summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate podcast summary' },
      { status: 500 }
    );
  }
} 