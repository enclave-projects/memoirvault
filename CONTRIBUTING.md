# Contributing to MemoirVault

Thank you for your interest in contributing to MemoirVault! We welcome contributions from the community and are grateful for your support in making this privacy-first journaling platform better.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, Next.js, and TypeScript

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/memoirvault.git
   cd memoirvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your development credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, etc.)

### Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Use the feature request template**
3. **Explain the use case** and potential impact
4. **Consider privacy implications** for any new features

### Code Contributions

#### Types of Contributions Welcome

- 🐛 **Bug fixes**
- ✨ **New features** (please discuss first in issues)
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🔒 **Security improvements**
- 🧪 **Test coverage**

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run test # when tests are available
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   # or
   git commit -m "fix: resolve bug description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat: add audio recording functionality
fix: resolve file upload timeout issue
docs: update API documentation
style: format components with prettier
refactor: optimize database queries
test: add unit tests for media upload
chore: update dependencies
```

## 🏗️ Project Structure

```
memoirvault/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard pages
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── forms/         # Form components
│   ├── lib/               # Utilities
│   │   ├── db/            # Database schema & client
│   │   ├── auth/          # Authentication helpers
│   │   └── utils/         # General utilities
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── docs/                  # Documentation
└── tests/                 # Test files
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Privacy-first**: Always consider user privacy in design decisions
- **Accessibility**: Follow WCAG 2.1 AA guidelines
- **Mobile-first**: Design for mobile, enhance for desktop
- **Consistency**: Use the established design system
- **Performance**: Optimize for speed and efficiency

### Color Palette

- **Primary Deep Green**: `#004838`
- **Accent Lime**: `#E2FB6C`
- **Secondary Forest**: `#073127`
- **Neutral Charcoal**: `#333F3C`
- **Light Gray**: `#EBEDE8`
- **Pure White**: `#FFFFFF`

### Typography

- **Primary**: Inter (body text, UI elements)
- **Secondary**: Crimson Text (headings, emotional content)
- **Monospace**: Fira Code (code, technical elements)

## 🔒 Security Guidelines

### Privacy Considerations

- **Data minimization**: Only collect necessary data
- **Encryption**: Encrypt sensitive data at rest and in transit
- **Access control**: Implement proper authorization
- **Audit logging**: Log security-relevant events
- **Third-party services**: Evaluate privacy implications

### Security Best Practices

- **Input validation**: Sanitize all user inputs
- **SQL injection**: Use parameterized queries
- **XSS prevention**: Escape output properly
- **CSRF protection**: Implement CSRF tokens
- **Rate limiting**: Prevent abuse and DoS attacks

## 🧪 Testing

### Testing Strategy

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test API endpoints and database operations
- **E2E tests**: Test complete user workflows
- **Security tests**: Test for common vulnerabilities

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📚 Documentation

### Documentation Standards

- **Clear and concise**: Write for your audience
- **Examples**: Provide code examples where helpful
- **Up-to-date**: Keep documentation current with code changes
- **Accessible**: Use clear language and proper formatting

### Types of Documentation

- **API documentation**: Document all API endpoints
- **Component documentation**: Document React components
- **Setup guides**: Help new contributors get started
- **Architecture docs**: Explain system design decisions

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Security review completed
- [ ] Performance impact assessed

## 💬 Communication

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: Real-time chat with the community
- **Email**: security@memoirvault.com for security issues

### Community Guidelines

- **Be respectful**: Treat everyone with kindness and respect
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone is learning
- **Be inclusive**: Welcome newcomers and diverse perspectives

## 🏆 Recognition

Contributors will be recognized in:

- **README.md**: Listed in the contributors section
- **CHANGELOG.md**: Credited for their contributions
- **Release notes**: Highlighted for significant contributions
- **Hall of Fame**: Special recognition for outstanding contributors

## 📞 Contact

- **Maintainers**: @enclave-projects
- **Security**: security@memoirvault.com
- **General**: hello@memoirvault.com

Thank you for contributing to MemoirVault! Together, we're building a better, more private way to preserve life stories. 🙏