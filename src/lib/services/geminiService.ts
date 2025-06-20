import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { PodcastEpisode } from './listenNotesService';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

// Configure the safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Generate a summary of a podcast episode using Gemini
 */
export async function generatePodcastSummary(episode: PodcastEpisode): Promise<string> {
  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings,
    });

    // Create the prompt
    const prompt = `
      Please provide a comprehensive summary of the following podcast episode:
      
      Title: ${episode.title}
      Publisher: ${episode.podcast.publisher}
      Description: ${episode.description}
      
      The summary should include:
      1. Main topics and themes discussed
      2. Key points and insights
      3. Any notable quotes or takeaways
      4. A brief conclusion
      
      Format the summary in clear paragraphs with proper spacing.
    `;

    // Generate the summary
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating podcast summary:', error);
    throw new Error('Failed to generate podcast summary');
  }
} 