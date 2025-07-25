# 🤝 Contributing to MemoirVault

Thank you for your interest in contributing to MemoirVault! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to pranjal.ai.arena@gmail.com.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React, Next.js, and TypeScript

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/enclave-projects/memoirvault.git
   cd memoirvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your development environment variables
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🛠️ How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug fixes** - Help us squash bugs
- **✨ New features** - Add new functionality
- **📚 Documentation** - Improve our docs
- **🎨 UI/UX improvements** - Make the app more beautiful and usable
- **🔧 Performance optimizations** - Make the app faster
- **🧪 Tests** - Improve our test coverage
- **🌐 Translations** - Help us support more languages

### Finding Issues to Work On

- Check our [GitHub Issues](https://github.com/enclave-projects/memoirvault/issues)
- Look for issues labeled `good first issue` for beginners
- Issues labeled `help wanted` are great for contributors
- Feel free to create new issues for bugs or feature requests

## 🔄 Pull Request Process

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** if one doesn't exist for your contribution
3. **Comment on the issue** to let others know you're working on it

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow our coding standards
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   # Test manually in the browser
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   # or
   git commit -m "fix: resolve issue with file deletion"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Fill out the PR template
   - Link to the related issue

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Clearly mark any breaking changes

## 📝 Coding Standards

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Auto-fix linting errors
```

### Naming Conventions

- **Files**: Use kebab-case for files (`user-profile.tsx`)
- **Components**: Use PascalCase (`UserProfile`)
- **Functions**: Use camelCase (`getUserProfile`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use proper type imports: `import type { User } from './types'`

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Use proper key props in lists
- Follow React accessibility guidelines
- Use semantic HTML elements

### Database

- Use Drizzle ORM for all database operations
- Create proper migrations for schema changes
- Use transactions for multi-step operations
- Follow proper indexing practices

## 🧪 Testing

### Running Tests

```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API routes
- Write component tests for React components
- Use meaningful test descriptions
- Mock external dependencies

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Include examples in documentation
- Document complex algorithms or business logic
- Keep comments up to date with code changes

### README Updates

- Update README.md for new features
- Add new environment variables to documentation
- Update installation instructions if needed
- Keep the feature list current

## 🏷️ Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```bash
feat: add AI helper bot integration
fix: resolve R2 file deletion for video files
docs: update deployment guide with new environment variables
style: format code with prettier
refactor: extract file upload logic to separate hook
perf: optimize database queries for timeline view
test: add unit tests for R2 client
chore: update dependencies to latest versions
```

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped in package.json
- [ ] Release notes are prepared

## 🆘 Getting Help

### Where to Ask Questions

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bug reports and feature requests
- **Discord/Slack**: For real-time chat (if available)
- **Email**: pranjal.ai.arena@gmail.com for direct contact

### Debugging Tips

- Use the `/debug` page to test R2 storage
- Check browser console for client-side errors
- Check server logs for API errors
- Use React Developer Tools for component debugging

## 🎉 Recognition

### Contributors

All contributors will be recognized in:

- README.md contributors section
- CHANGELOG.md for their contributions
- GitHub contributors page
- Special mentions in release notes

### Hall of Fame

Outstanding contributors may be featured in our Hall of Fame with:

- Profile picture and bio
- List of major contributions
- Special contributor badge

## 📞 Contact

- **Project Maintainer**: Pranjal (pranjal.ai.arena@gmail.com)
- **GitHub**: [@enclave-projects](https://github.com/enclave-projects)
- **Issues**: [GitHub Issues](https://github.com/enclave-projects/memoirvault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/enclave-projects/memoirvault/discussions)

---

Thank you for contributing to MemoirVault! Your help makes this project better for everyone. 🙏