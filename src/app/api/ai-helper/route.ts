import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        const model = process.env.GEMINI_AI_MODEL || 'gemma-3-4b-it';

        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        // Create system prompt for MemoirVault context
        const systemPrompt = `You are Memo, a helpful AI assistant for MemoirVault, a privacy-first memoir and autobiography writing platform. 

Your role is to help users with:
- Writing and organizing their life stories
- Overcoming writer's block
- Suggesting memoir topics and prompts
- Technical support with the platform
- Privacy and data security questions
- Storage management and file organization
- General memoir writing advice

Key features of MemoirVault:
- Privacy-first design with no tracking
- Support for text, images, audio, and video
- 2GB free storage per user, with upgrade options (upgrade option is not implemented yet)
- Secure cloud storage with Cloudflare R2
- Timeline view of memories
- Complete data ownership and control
- User data and memory are E2E encrypted

Always be supportive, encouraging, and respectful of users' personal stories. Provide practical, actionable advice. 

If users report technical issues or bugs, provide helpful troubleshooting steps and let them know they can report issues through the "Report Issue" section in Settings if the problem persists.

User message: ${message}`;

        // Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
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
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return NextResponse.json({
                error: 'Failed to get AI response',
                details: response.status === 400 ? 'Invalid request' : 'Service unavailable'
            }, { status: 500 });
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            return NextResponse.json({
                error: 'No response generated',
                message: 'The AI assistant couldn\'t generate a response. Please try rephrasing your question.'
            }, { status: 500 });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        return NextResponse.json({
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI Helper API error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: 'Something went wrong. Please try again later.'
        }, { status: 500 });
    }
}