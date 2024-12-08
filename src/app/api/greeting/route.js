// src/app/api/greeting/route.js

import { Anthropic } from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateMessagePrompt = (occasion, relationship, recipientName, context, isGeneric) => {
    const { memories, futureWishes, additionalText, additionalNote } = context;
  
    let prompt = `Write a heartfelt ${occasion} message ${isGeneric ? `for a ${relationship}` : `for ${recipientName} (a ${relationship})`}.
  
      Context to incorporate:
      ${memories ? `- Shared memories: ${memories}` : ''}
      ${futureWishes ? `- Future wishes/plans: ${futureWishes}` : ''}
      ${additionalText ? `- Additional context: ${additionalText}` : ''}
      
      Requirements:
      - Keep the message between 2-3 impactful sentences
      - Do not mention that this is a greeting card or message
      - Write ONLY the message that would appear in the card, nothing else
      - Maximum 200 characters
      - Make it warm and personal
      - Avoid lengthy descriptions
      - Include specific references to the provided memories and wishes if given
      - Make it emotionally resonant and meaningful
      - Include appropriate emojis throughout the message
      - ${isGeneric ? 'Keep it generic without using names' : `Include "${recipientName}" naturally in the message`}
      ${additionalNote ? `- Add this as a separate line at the end: "${additionalNote}"` : ''}
      
      Format the message with proper spacing and line breaks for better readability.`;
  
    return prompt;
  };

export async function POST(request) {
  try {
    const body = await request.json();
    const { occasion, relationship, recipientName, additionalText, isGeneric } = body;

    if (!occasion || !relationship) {
      return Response.json(
        { error: 'Missing required fields: occasion and relationship are required' },
        { status: 400 }
      );
    }

    if (!isGeneric && !recipientName) {
      return Response.json(
        { error: 'Recipient name is required for personalized messages' },
        { status: 400 }
      );
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        messages: [{ 
          role: 'user', 
          content: generateMessagePrompt(
            occasion,
            relationship,
            recipientName,
            additionalText,
            isGeneric
          )
        }]
      });

      // Clean up any potential prefixes or explanatory text
      let message = response.content[0].text;
      
      // Remove common prefixes that Claude might add
      message = message.replace(/^(Here'?s? (?:a|your) message:?\s*)/i, '');
      message = message.replace(/^(Here'?s? (?:what|something) (?:you|I) could say:?\s*)/i, '');
      message = message.replace(/^(You could write:?\s*)/i, '');
      message = message.replace(/^(Message:?\s*)/i, '');
      
      // Trim any quotes and whitespace
      message = message.replace(/^["']|["']$/g, '').trim();

      return Response.json({ message });

    } catch (anthropicError) {
      console.error('Claude API error:', anthropicError);
      return Response.json(
        { error: 'Failed to generate message: ' + anthropicError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Server error:', error);
    return Response.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}