# Development Guidelines

## Code Quality Standards

### TypeScript Best Practices
- Use proper type definitions for all functions and components
- Avoid `any` type - use proper interfaces and types
- Use `import type` for type-only imports
- Define interfaces for all API responses and database entities

### React Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries for user-facing components
- Use semantic HTML elements for accessibility
- Follow React accessibility guidelines (WCAG 2.1 AA)
- Use proper key props in lists and dynamic content

### API Development
- Follow RESTful conventions for API endpoints
- Implement comprehensive error handling with proper HTTP status codes
- Use Drizzle ORM for all database operations
- Include proper authentication checks using Clerk
- Add logging for debugging and monitoring

### File Management
- Always use the R2 utility functions from `src/lib/r2.ts`
- Implement proper file cleanup when deleting entries
- Check file existence before attempting deletion
- Use consistent file naming patterns with entry IDs
- Handle upload timeouts dynamically based on file size and type

### Database Operations
- Use transactions for multi-step operations
- Implement proper cascade deletes for data integrity
- Include userId in all queries for data isolation
- Use proper indexing for performance
- Follow Drizzle ORM best practices

## Security Guidelines

### Authentication & Authorization
- Always verify user authentication in API routes
- Use Clerk's `auth()` function for server-side authentication
- Implement proper route protection with middleware
- Validate user ownership of resources before operations

### Data Privacy
- Never log sensitive user data
- Implement proper data sanitization
- Use environment variables for all secrets
- Follow GDPR compliance requirements
- Provide clear data export and deletion capabilities

### Input Validation
- Validate all user inputs on both client and server side
- Sanitize file uploads and check file types
- Implement proper rate limiting for API endpoints
- Use parameterized queries to prevent SQL injection

## UI/UX Guidelines

### Design Principles
- Maintain consistent spacing and typography
- Use the established color palette (#004838, #E2FB6C, #333F3C, #EBEDE8)
- Implement responsive design with mobile-first approach
- Use backdrop blur effects for modals and overlays
- Provide clear loading states and error messages

### Accessibility
- Use semantic HTML elements
- Provide proper alt text for images
- Implement keyboard navigation support
- Ensure sufficient color contrast ratios
- Use ARIA labels where appropriate

### User Feedback
- Provide immediate feedback for user actions
- Use toast notifications for success/error messages
- Implement progress indicators for long operations
- Show clear confirmation dialogs for destructive actions

## Testing Guidelines

### Unit Testing
- Write tests for utility functions and API endpoints
- Mock external dependencies (R2, database, AI APIs)
- Test error conditions and edge cases
- Maintain good test coverage for critical paths

### Integration Testing
- Test API routes with proper authentication
- Verify file upload and deletion workflows
- Test database operations with real data
- Validate AI integration functionality

### Manual Testing
- Test all user workflows end-to-end
- Verify responsive design on different devices
- Test accessibility with screen readers
- Validate error handling and recovery

## Performance Guidelines

### Frontend Optimization
- Use Next.js Image component for optimized images
- Implement proper code splitting and lazy loading
- Minimize bundle size with tree shaking
- Use React.memo for expensive components

### Backend Optimization
- Implement proper database indexing
- Use connection pooling for database connections
- Optimize file upload handling for large files
- Cache frequently accessed data where appropriate

### Storage Optimization
- Implement proper file compression where possible
- Use appropriate file formats for different media types
- Clean up orphaned files regularly
- Monitor storage usage and implement limits

## Debugging Guidelines

### Development Tools
- Use the `/debug` page for R2 storage testing
- Check browser console for client-side errors
- Monitor server logs for API errors
- Use React Developer Tools for component debugging

### Error Handling
- Implement comprehensive error logging
- Provide meaningful error messages to users
- Use proper error boundaries in React components
- Handle network errors gracefully

### Monitoring
- Track storage usage and performance metrics
- Monitor API response times and error rates
- Log user feedback and issue reports
- Use GitHub integration for bug tracking

## Deployment Guidelines

### Environment Configuration
- Use proper environment variables for all configurations
- Implement different configs for development/production
- Secure all API keys and secrets
- Use proper CORS settings for production

### Database Management
- Run migrations before deploying new versions
- Backup database before major changes
- Monitor database performance and connections
- Implement proper error recovery

### File Storage
- Verify R2 bucket configuration and permissions
- Test file upload/deletion in production environment
- Monitor storage usage and costs
- Implement proper backup strategies

## AI Integration Guidelines

### Google Gemini API
- Use proper API key management and rotation
- Implement rate limiting and error handling
- Provide context-aware prompts for better responses
- Respect user privacy in AI interactions

### User Experience
- Provide clear indication when AI is being used
- Allow users to opt-out of AI features
- Implement proper loading states for AI responses
- Handle AI service outages gracefully

## Issue Reporting & Feedback

### GitHub Integration
- Use structured issue templates for bug reports
- Include proper labels and categorization
- Provide sufficient context and reproduction steps
- Follow up on user-reported issues promptly

### User Feedback
- Encourage user feedback through in-app reporting
- Respond to user issues in a timely manner
- Implement requested features based on user needs
- Maintain transparency in development process