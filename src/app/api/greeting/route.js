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

// src/app/api/greeting/route.js
// src/app/api/greeting/route.js
// import { HfInference } from '@huggingface/inference';

// const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// export async function POST(request) {
//   try {
//     // Log incoming request
//     console.log('API called with body:', await request.clone().json());

//     const body = await request.json();
//     const { occasion, relationship, recipientName, isGeneric, context } = body;

//     // Validate required fields
//     if (!occasion || !relationship) {
//       return Response.json(
//         { error: 'Missing required fields: occasion and relationship are required.' },
//         { status: 400 }
//       );
//     }

//     // Prepare the input for the model
//     const greetingInput = `Generate a greeting message based on the following information:
//       Relation: ${relationship}
//       Occasion: ${occasion}
//       Recipient Name: ${isGeneric ? 'Generic' : recipientName}
//       Context: ${context?.memories || 'None provided'}
//       Additional Note: ${context?.additionalNote || 'None'}

//       Please create a personalized and heartfelt message that reflects the relationship and occasion. Use the provided context and additional note to make the message more meaningful and specific.
      
//       Greeting:`;

//     // Call Hugging Face API for text generation using distilgpt2
//     const response = await hf.textGeneration({
//       model: "distilgpt2",  // Using distilgpt2 model for better performance
//       inputs: greetingInput,
//       parameters: {
//         max_new_tokens: 500,  // Adjust as necessary
//         return_full_text: false,
//       },
//     });

//     // Check if response is empty
//     if (!response.generated_text || response.generated_text.trim() === '') {
//       console.error('Received an empty response from Hugging Face API');
//       return Response.json(
//         { error: 'The generated text is empty.' },
//         { status: 500 }
//       );
//     }

//     // Log successful response
//     console.log('Hugging Face API response:', response);

//     return Response.json({
//       message: response.generated_text,
//       status: 'success',
//     });
//   } catch (hfError) {
//     console.error('Hugging Face API error:', hfError);
    
//     // Handle specific errors from Hugging Face API
//     const errorMessage = hfError.response?.data?.error || 'Failed to generate message with Hugging Face API';
    
//     return Response.json(
//       { error: errorMessage },
//       { status: 500 }
//     );
//   } 
// }
