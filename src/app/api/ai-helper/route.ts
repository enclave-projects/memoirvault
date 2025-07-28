import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { message, stream = false } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
        const model = process.env.GEMINI_AI_MODEL || 'gemini-1.5-flash';

        if (!apiKey) {
            console.error('Gemini API key not found in environment variables');
            return NextResponse.json({ 
                error: 'AI service temporarily unavailable',
                message: 'The AI assistant is currently unavailable. Please try again later or contact support.'
            }, { status: 503 });
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

Always be supportive, encouraging, and respectful of users' personal stories. Provide practical, actionable advice. Format your responses using markdown for better readability.

If users report technical issues or bugs, provide helpful troubleshooting steps and let them know they can report issues through the "Report Issue" section in Settings if the problem persists.

User message: ${message}`;
        
        if (stream) {
            // Simulate streaming by getting the full response and streaming it word by word
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            
            console.log('Calling Gemini API for streaming simulation with model:', model);
            
            const response = await fetch(apiUrl, {
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

            const fullResponse = data.candidates[0].content.parts[0].text;

            // Create a readable stream that simulates streaming by sending words progressively
            const encoder = new TextEncoder();
            const readableStream = new ReadableStream({
                async start(controller) {
                    try {
                        const words = fullResponse.split(' ');
                        let currentText = '';
                        
                        for (let i = 0; i < words.length; i++) {
                            currentText += (i > 0 ? ' ' : '') + words[i];
                            
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: words[i] + (i < words.length - 1 ? ' ' : '') })}\n\n`));
                            
                            // Add a small delay to simulate streaming
                            await new Promise(resolve => setTimeout(resolve, 50));
                        }
                        
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                    } catch (error) {
                        console.error('Streaming simulation error:', error);
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`));
                    } finally {
                        controller.close();
                    }
                }
            });

            return new Response(readableStream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        // Non-streaming response (fallback)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        console.log('Calling Gemini API with model:', model);
        
        const response = await fetch(apiUrl, {
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
            console.error('Gemini API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
                model: model,
                apiKeyPresent: !!apiKey
            });
            
            let errorMessage = 'I\'m sorry, I\'m having trouble responding right now. Please try again in a moment.';
            
            if (response.status === 400) {
                errorMessage = 'There was an issue with your request. Please try rephrasing your question.';
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = 'AI service authentication failed. Please contact support.';
            } else if (response.status === 429) {
                errorMessage = 'AI service is busy. Please wait a moment and try again.';
            }
            
            return NextResponse.json({
                error: 'AI service error',
                message: errorMessage
            }, { status: 500 });
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            console.error('No candidates in Gemini response:', data);
            return NextResponse.json({
                error: 'No response generated',
                message: 'I\'m sorry, I couldn\'t generate a response to that. Could you try asking in a different way?'
            }, { status: 500 });
        }

        if (!data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            console.error('Invalid response structure from Gemini:', data);
            return NextResponse.json({
                error: 'Invalid response format',
                message: 'I\'m sorry, I\'m having trouble responding right now. Please try again in a moment.'
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