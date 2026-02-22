import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-2.0-flash'),
    system: `You are an expert Clinical Play Therapy Mentor. 
    Your goal is to guide students and professionals in Child-Centered Play Therapy (CCPT).
    
    When you describe a specific technique or create a handout, wrap it in a structural block like this:
    [ARTIFACT_START]
    {
      "title": "...",
      "type": "handout",
      "content": "..."
    }
    [ARTIFACT_END]
    
    Keep the chat dialogue minimalist and professional. Use the 'Paper' aesthetic in your descriptions.`,
    messages,
  });

  return result.toDataStreamResponse();
}
