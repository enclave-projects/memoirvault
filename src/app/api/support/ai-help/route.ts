import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: `I'd be happy to help you with "${query}"! However, the AI assistant is currently unavailable. 

Here are some ways I can still help you:

1. **Browse our Help Articles**: Check the categories on the left to find relevant articles
2. **Search**: Use the search bar to find specific topics
3. **Contact Support**: Our human support team is available 24/7 at support@memoirvault.com

Common topics you might be looking for:
- Getting started with your first memoir entry
- Privacy and security information
- File upload and storage management
- Public sharing and privacy controls

Is there a specific topic you'd like me to help you find in our help articles?`
      });
    }

    // Create a context-aware prompt
    const contextText = context
      ?.map((article: any) => `Q: ${article.question}\nA: ${article.answer}`)
      .join('\n\n') || '';

    const prompt = `You are a helpful AI assistant for MemoirVault, a privacy-first digital memoir platform. 

Based on the following help articles and user question, provide a helpful, accurate response. If the question isn't covered in the help articles, provide general guidance about MemoirVault features while encouraging the user to contact support for specific issues.

Help Articles Context:
${contextText}

User Question: ${query}

Please provide a helpful, friendly response that:
1. Directly answers their question if possible
2. References relevant help articles
3. Maintains MemoirVault's privacy-first messaging
4. Suggests contacting support if needed
5. Keeps the response concise but informative

Response:`;

    // Make request to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-3n-e2b-it:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'I apologize, but I couldn\'t generate a response. Please try rephrasing your question or contact our support team.';

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Error getting AI help:', error);
    return NextResponse.json({
      response: `I apologize, but I'm having trouble processing your request right now. 

For immediate assistance, please:
1. Browse our help articles using the categories on the left
2. Contact our support team at support@memoirvault.com
3. Visit our community forum for peer support

Our human support team is always available to help with any questions about MemoirVault!`
    });
  }
}