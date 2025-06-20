import mongoose, { Schema } from 'mongoose';

// Define the interface for the PodcastSummary document
export interface IPodcastSummary {
  podcast_id: string;
  summary: string;
  created_at: Date;
}

// Create the schema
const PodcastSummarySchema = new Schema<IPodcastSummary>({
  podcast_id: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create and export the model
export default mongoose.models.PodcastSummary || 
  mongoose.model<IPodcastSummary>('PodcastSummary', PodcastSummarySchema); 