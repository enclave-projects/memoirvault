import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { helpArticles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Sample help articles data
const sampleArticles = [
  {
    title: 'Getting Started with MemoirVault',
    question: 'How do I create my first memoir entry?',
    answer: `Creating your first memoir entry is simple and intuitive:

1. Sign up or log in to your MemoirVault account
2. Navigate to your dashboard where you'll see the "New Entry" button
3. Click "New Entry" to open the entry creation form
4. Add a title that captures the essence of your memory
5. Write your story in the rich text editor - you can format text, add links, and more
6. Upload media by dragging and dropping images, videos, or audio files
7. Save your entry - it will be automatically saved to your private timeline

Your entries are completely private by default. You can choose to make specific entries public later if you wish to share your story with others.`,
    category: 'general',
    tags: ['getting started', 'first entry', 'tutorial', 'basics']
  },
  {
    title: 'Account Security and Privacy',
    question: 'How secure is my data on MemoirVault?',
    answer: `Your privacy and security are our top priorities. Here's how we protect your data:

Encryption: All your data is encrypted both in transit (TLS 1.3) and at rest (AES-256-GCM)

Zero-Knowledge Architecture: We cannot access your personal content - your data is encrypted with keys only you control

Authentication: Multi-factor authentication powered by Clerk with OAuth2 and biometric support

Compliance: We're fully GDPR and CCPA compliant, giving you complete control over your data

No Tracking: We don't use analytics, tracking cookies, or sell your data to third parties

Infrastructure: Hosted on enterprise-grade infrastructure with 99.9% uptime and DDoS protection

You can export or delete all your data at any time through your account settings.`,
    category: 'privacy',
    tags: ['security', 'privacy', 'encryption', 'data protection', 'GDPR']
  },
  {
    title: 'Managing Your Storage',
    question: 'How much storage do I get and how can I manage it?',
    answer: `MemoirVault provides generous storage for your memories:

Free Tier: 2GB of storage for all your text, images, videos, and audio files

Storage Tracking: View your current usage in real-time from your dashboard settings

File Management: 
- Supported formats: Images (JPEG, PNG, WebP), Videos (MP4, WebM), Audio (MP3, WAV, M4A)
- Maximum file size: 100MB per file
- Automatic compression for images to save space

Optimization Tips:
- Use WebP format for images (automatically converted)
- Compress videos before uploading for better performance
- Delete unused entries to free up space

Future Plans: We're working on premium storage tiers with increased limits and additional features. Your data will always remain private regardless of your plan.`,
    category: 'technical',
    tags: ['storage', 'limits', 'files', 'media', 'optimization']
  },
  {
    title: 'Public Sharing and Privacy Controls',
    question: 'Can I share my memoir entries publicly?',
    answer: `Yes! MemoirVault offers flexible sharing options while maintaining your privacy:

Default Privacy: All entries are private by default - only you can see them

Public Sharing Options:
- Make individual entries public while keeping others private
- Create a public profile to share your memoir journey
- Follow other memoir writers and discover inspiring stories

Privacy Controls:
- Choose which entries to make public from your dashboard
- Control your public profile visibility and information
- Disable public sharing entirely if you prefer complete privacy

Social Features:
- Follow other memoir writers
- Discover public stories in the community feed
- Connect with people sharing similar experiences

Safety: Even with public sharing enabled, your personal information remains protected. You control exactly what gets shared and what stays private.`,
    category: 'features',
    tags: ['sharing', 'public', 'privacy', 'social', 'community']
  },
  {
    title: 'AI Writing Assistant',
    question: 'How does the AI writing assistant work?',
    answer: `Our AI writing assistant helps you craft better memoir entries while maintaining your privacy:

How it Works:
- Powered by Google Gemini AI for intelligent suggestions
- Provides context-aware writing prompts and improvements
- Helps overcome writer's block with creative suggestions

Privacy Protection:
- Your personal content is never stored by the AI service
- All interactions are encrypted and temporary
- You can disable AI assistance at any time

Features:
- Writing prompts based on your entry context
- Grammar and style suggestions
- Help expanding on memories and experiences
- Creative writing assistance for storytelling

Usage:
- Click the AI assistant button while writing an entry
- Ask specific questions about your writing
- Get suggestions for improving clarity and engagement

The AI assistant is designed to enhance your writing while keeping your memories completely private and secure.`,
    category: 'features',
    tags: ['AI', 'writing', 'assistant', 'prompts', 'help']
  },
  {
    title: 'Troubleshooting Upload Issues',
    question: 'Why are my file uploads failing?',
    answer: `If you're experiencing upload issues, here are common solutions:

File Size and Format:
- Maximum file size: 100MB per file
- Supported formats: JPEG, PNG, WebP, MP4, WebM, MP3, WAV, M4A
- Try compressing large files before uploading

Connection Issues:
- Ensure you have a stable internet connection
- Try refreshing the page and uploading again
- Clear your browser cache and cookies

Browser Compatibility:
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Disable browser extensions that might interfere
- Try uploading in an incognito/private window

Storage Limits:
- Check if you've reached your 2GB storage limit
- Delete unused entries to free up space
- Contact support if you need additional storage

Still Having Issues?:
- Try uploading one file at a time
- Restart your browser
- Contact our support team with specific error messages

Our team monitors upload performance and will investigate any widespread issues immediately.`,
    category: 'technical',
    tags: ['upload', 'files', 'troubleshooting', 'errors', 'technical support']
  }
];

export async function GET(request: NextRequest) {
  try {
    // First, check if we have articles in the database
    const existingArticles = await db.select().from(helpArticles);
    
    // If no articles exist, seed with sample data
    if (existingArticles.length === 0) {
      await db.insert(helpArticles).values(sampleArticles);
      const articles = await db.select().from(helpArticles);
      return NextResponse.json({ articles });
    }

    // Check if existing articles contain markdown formatting (need to refresh)
    const hasMarkdown = existingArticles.some(article => 
      article.answer.includes('**') || article.answer.includes('- ')
    );

    if (hasMarkdown) {
      // Clear existing articles and insert fresh ones
      await db.delete(helpArticles);
      await db.insert(helpArticles).values(sampleArticles);
      const articles = await db.select().from(helpArticles);
      return NextResponse.json({ articles });
    }

    return NextResponse.json({ articles: existingArticles });

  } catch (error) {
    console.error('Error fetching help articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch help articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, question, answer, category, tags } = body;

    // Validate required fields
    if (!title || !question || !answer) {
      return NextResponse.json(
        { error: 'Title, question, and answer are required' },
        { status: 400 }
      );
    }

    // Insert new article
    const [article] = await db.insert(helpArticles).values({
      title: title.trim(),
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'general',
      tags: tags || [],
      isPublished: true
    }).returning();

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Error creating help article:', error);
    return NextResponse.json(
      { error: 'Failed to create help article' },
      { status: 500 }
    );
  }
}