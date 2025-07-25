import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, userEmail } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    const repoOwner = 'enclave-projects'; // Replace with your GitHub username
    const repoName = 'memoirvault'; // Replace with your repository name

    console.log('GitHub token configured:', !!githubToken);
    console.log('Repository:', `${repoOwner}/${repoName}`);

    if (!githubToken) {
      console.error('GitHub token not found in environment variables');
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    // Create issue body with user information
    const issueBody = `## Issue Description
${description}

## User Information
- **User ID**: ${userId}
- **Email**: ${userEmail || 'Not provided'}
- **Reported via**: AI Helper Bot
- **Timestamp**: ${new Date().toISOString()}

## Environment
- **Platform**: Web Application
- **Browser**: User Agent will be in server logs
- **Date**: ${new Date().toLocaleDateString()}

---
*This issue was automatically created by the MemoirVault AI Helper Bot based on user feedback.*`;

    // Create GitHub issue
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'MemoirVault-AI-Bot'
      },
      body: JSON.stringify({
        title: `[AI Bot Report] ${title}`,
        body: issueBody,
        labels: ['bug', 'user-report', 'ai-generated']
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GitHub API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        repository: `${repoOwner}/${repoName}`,
        tokenPresent: !!githubToken
      });
      return NextResponse.json({ 
        error: 'Failed to create GitHub issue',
        details: response.status === 401 ? 'Invalid GitHub token' : `GitHub API error: ${response.status}`,
        status: response.status
      }, { status: 500 });
    }

    const issueData = await response.json();

    return NextResponse.json({
      success: true,
      issueNumber: issueData.number,
      issueUrl: issueData.html_url,
      message: 'Issue created successfully'
    });

  } catch (error) {
    console.error('Create GitHub issue error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to create issue. Please try again later.'
    }, { status: 500 });
  }
}