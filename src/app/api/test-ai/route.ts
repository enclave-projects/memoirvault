import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
        const model = process.env.GEMINI_AI_MODEL || 'gemini-1.5-flash';

        return NextResponse.json({
            status: 'API Test',
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey ? apiKey.length : 0,
            model: model,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Test failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}