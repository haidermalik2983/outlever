const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';


export async function summarizeText(transcript: string): Promise<string> {
  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes podcast transcripts.',
        },
        {
          role: 'user',
          content: `Summarize the following podcast transcript:

${transcript}

The summary should include main topics, key points, notable quotes, and a brief conclusion. Format in clear paragraphs.`,
        },
      ],
      max_tokens: 512,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}