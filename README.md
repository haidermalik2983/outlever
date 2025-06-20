# Outlever Podcast Summarizer

A web application that fetches podcasts from the Listen Notes API, lets users select episodes, and generates summaries using the Gemini AI model. The summaries are stored in MongoDB for future reference.

## Features

- 🔍 **Podcast Discovery**: Browse trending podcasts or search for specific episodes
- 🧠 **AI Summarization**: Generate summaries of podcast episodes using Google's Gemini AI model
- 📂 **Persistence**: Store and retrieve summaries from MongoDB
- 🎨 **Modern UI**: Clean, responsive interface built with Next.js, React, Tailwind CSS, and Shadcn UI

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **APIs**: Listen Notes API, Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Listen Notes API key
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/outlever-podcast-summarizer.git
   cd outlever-podcast-summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   LISTEN_NOTES_API_KEY=your_listen_notes_api_key
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy!

## Project Structure

```
/src
  /app
    /api
      /podcasts
        route.ts        # API endpoint for fetching podcasts
      /summary
        route.ts        # API endpoint for generating/retrieving summaries
    layout.tsx          # Root layout component
    page.tsx            # Main page component
  /components
    PodcastCard.tsx     # Card component for displaying podcast episodes
    PodcastSummary.tsx  # Component for displaying summaries
    SearchBar.tsx       # Search bar component
    /ui                 # Shadcn UI components
  /lib
    /db
      mongodb.ts        # MongoDB connection utility
    /models
      PodcastSummary.ts # MongoDB model for podcast summaries
    /services
      listenNotesService.ts # Service for interacting with Listen Notes API
      geminiService.ts      # Service for generating summaries with Gemini
```

## License

This project is licensed under the MIT License.
