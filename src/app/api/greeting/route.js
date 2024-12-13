// src/app/api/greeting/route.js

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    // Log incoming request
    console.log('API called with body:', await request.clone().json());

    const body = await request.json();
    const { occasion, relationship, recipientName, isGeneric, context } = body;

    if (!occasion || !relationship) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        messages: [{ 
          role: 'user',
          content: `Create a ${occasion} message for ${isGeneric ? `a ${relationship}` : recipientName}.
                   Context: ${context?.memories || 'None provided'}
                   Additional Note: ${context?.additionalNote || 'None'}
                   Make it personal and include appropriate emojis.`
        }]
      });

      // Log successful response
      console.log('Claude API response:', response);

      return Response.json({ 
        message: response.content[0].text,
        status: 'success' 
      });

    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      return Response.json(
        { error: 'Failed to generate message with Claude API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Server error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}