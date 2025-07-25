# 🚀 Deployment Guide for MemoirVault

## Vercel Deployment Setup

### 1. Environment Variables Configuration

You need to add the following environment variables in your Vercel dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `memoirvault` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

#### Required Environment Variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudflare R2
BUCKET_NAME=your_bucket_name
ACCESS_KEY_ID=your_r2_access_key
SECRET_ACCESS_KEY=your_r2_secret_key
PUBLIC_DEVELOPMENT_URL=https://pub-your-bucket-id.r2.dev

# NeonDB
DATABASE_URL=your_neon_database_url

# AI Features (Optional)
GEMINI_API_KEY=your_gemini_api_key

# GitHub Integration (Optional)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=your_repository_name
```

### 2. Clerk Domain Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **Settings** → **Domains**
4. Add your Vercel domain: `memoirvault.vercel.app`
5. Also add any preview domains if needed

### 3. Database Setup

Make sure your NeonDB is accessible from Vercel:
1. Check that your DATABASE_URL is correct
2. Ensure the database allows connections from Vercel's IP ranges
3. Run database migrations if needed:
   ```bash
   npm run db:migrate
   ```

### 4. AI Features Setup (Optional)

For AI helper functionality:
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `GEMINI_API_KEY` to your environment variables

### 5. GitHub Integration Setup (Optional)

For issue reporting functionality:
1. Create a GitHub Personal Access Token with `repo` permissions
2. Add the following environment variables:
   - `GITHUB_TOKEN`: Your personal access token
   - `GITHUB_REPO_OWNER`: Your GitHub username
   - `GITHUB_REPO_NAME`: Your repository name

### 6. Redeploy

After adding environment variables:
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Troubleshooting

### Common Issues:

1. **MIDDLEWARE_INVOCATION_FAILED**
   - Missing Clerk environment variables
   - Incorrect Clerk domain configuration
   - Database connection issues

2. **Authentication Errors**
   - Check Clerk publishable key is public (starts with `pk_`)
   - Verify domain is added to Clerk dashboard
   - Ensure secret key is correctly set

3. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check NeonDB connection limits
   - Ensure SSL mode is correctly configured

4. **AI Features Not Working**
   - Check GEMINI_API_KEY is correctly set
   - Verify API key has proper permissions
   - Check API usage limits

5. **GitHub Integration Issues**
   - Verify GITHUB_TOKEN has repo permissions
   - Check repository owner and name are correct
   - Ensure token hasn't expired

### Debug Steps:

1. Check Vercel Function logs:
   - Go to Vercel Dashboard → Functions
   - Check error logs for specific error messages

2. Test environment variables:
   - Ensure all required variables are set
   - Check for typos in variable names

3. Verify external services:
   - Test Clerk authentication locally
   - Check NeonDB connectivity
   - Verify Cloudflare R2 access

## Manual Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Clerk domain added and verified
- [ ] Database accessible and migrations run
- [ ] Cloudflare R2 bucket configured and accessible
- [ ] SSL certificates valid
- [ ] Custom domain configured (if applicable)
- [ ] AI features tested (if enabled)
- [ ] GitHub integration tested (if enabled)
- [ ] Debug endpoints secured for production
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
