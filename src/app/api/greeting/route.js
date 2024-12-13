// src/app/api/greeting/route.js

import { Anthropic } from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateMessagePrompt = (occasion, relationship, recipientName, context, isGeneric) => {
    const { memories, additionalNote } = context;
  
    let prompt = `Generate a heartfelt ${occasion} message ${isGeneric ? `for a ${relationship}` : `for ${recipientName} (a ${relationship})`}.
  
      Primary Context to Focus on:
      ${memories ? `- KEY CONTEXT: ${memories}
        This context should be the main theme/focus of the message.` : ''}
      
      Message Requirements:
      - Heavily incorporate the provided context into the message's main body
      - Keep the message length to 2-3 impactful sentences
      - Make it personal and emotional
      - Include 2-3 appropriate emojis
      - ${isGeneric ? 'Keep it generic without using names' : `Include "${recipientName}" naturally in the message`}
      
      ${additionalNote ? `After the main message, add this as a distinctly separate line:
      "${additionalNote}"` : ''}
  
      Note: Focus heavily on the provided context in the main message body. The message should feel like it's specifically written based on the given context.
  
      Example Format:
      [Main message incorporating the primary context]
      [Separate line with additional note if provided]`;
  
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