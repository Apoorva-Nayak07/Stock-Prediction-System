# Contributing to AI Stock Market Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all.

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### 1. Fork the Repository
```bash
# Click "Fork" on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-stock-platform.git
cd ai-stock-platform
```

### 2. Set Up Development Environment
```bash
# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/ai-stock-platform.git

# Install dependencies
npm run install-all

# Create .env files
cp .env.example .env
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## Development Process

### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

Examples:
- `feature/add-crypto-support`
- `fix/portfolio-calculation-bug`
- `docs/update-api-documentation`

### Development Workflow

1. **Sync with upstream**
```bash
git fetch upstream
git merge upstream/main
```

2. **Make changes**
- Write clean, readable code
- Follow coding standards
- Add tests for new features
- Update documentation

3. **Test your changes**
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# AI service tests
cd ai-service && pytest
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add new feature"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

---

## Coding Standards

### JavaScript/Node.js

**Style Guide:**
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Use async/await over callbacks
- Use meaningful variable names

**Example:**
```javascript
// Good
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`User not found: ${error.message}`);
  }
};

// Bad
var getUser = function(id, callback) {
  User.findById(id, function(err, u) {
    if (err) callback(err);
    callback(null, u);
  });
};
```

### React

**Component Structure:**
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default MyComponent;
```

### Python

**Style Guide:**
- Follow PEP 8
- Use type hints
- Write docstrings
- Use meaningful names

**Example:**
```python
from typing import Dict, List

def analyze_sentiment(text: str) -> Dict[str, float]:
    """
    Analyze sentiment of given text.
    
    Args:
        text: Input text to analyze
        
    Returns:
        Dictionary with sentiment scores
    """
    # Implementation
    return {"score": 0.5, "confidence": 0.8}
```

### File Organization

```
component/
├── ComponentName.js       # Component logic
├── ComponentName.test.js  # Tests
└── ComponentName.css      # Styles (if not using Tailwind)
```

---

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Maintenance tasks

### Examples
```bash
feat(predictions): add LSTM model for price prediction

Implemented LSTM neural network for stock price forecasting.
Added training pipeline and model evaluation metrics.

Closes #123

---

fix(portfolio): correct profit/loss calculation

Fixed bug where portfolio P&L was calculated incorrectly
when stocks were added on different dates.

Fixes #456

---

docs(api): update authentication endpoints

Added examples for JWT token usage and error responses.
```

---

## Pull Request Process

### Before Submitting

1. **Update documentation**
   - Update README if needed
   - Add/update API documentation
   - Update CHANGELOG

2. **Run tests**
```bash
npm test
```

3. **Check code quality**
```bash
npm run lint
```

4. **Update dependencies**
```bash
npm audit fix
```

### Submitting PR

1. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch

2. **Fill PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

3. **Wait for Review**
   - Address reviewer comments
   - Make requested changes
   - Push updates to same branch

---

## Testing

### Unit Tests

**Backend:**
```javascript
describe('User Authentication', () => {
  it('should register new user', async () => {
    const user = await authController.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user).toHaveProperty('token');
  });
});
```

**Frontend:**
```javascript
import { render, screen } from '@testing-library/react';
import StockCard from './StockCard';

test('renders stock card', () => {
  const stock = { symbol: 'AAPL', price: 150 };
  render(<StockCard stock={stock} />);
  expect(screen.getByText('AAPL')).toBeInTheDocument();
});
```

**AI Service:**
```python
def test_prediction_service():
    service = PredictionService()
    result = await service.predict('AAPL')
    assert 'predictedPrice' in result
    assert result['confidence'] > 0
```

### Integration Tests

Test complete workflows:
- User registration → Login → Add to portfolio
- Stock search → View details → Generate prediction
- Sentiment analysis → View sources → Save to watchlist

---

## Documentation

### Code Comments

```javascript
/**
 * Calculate portfolio profit/loss
 * @param {Array} holdings - Array of stock holdings
 * @param {Object} currentPrices - Current stock prices
 * @returns {Object} Portfolio summary with P&L
 */
const calculatePortfolio = (holdings, currentPrices) => {
  // Implementation
};
```

### API Documentation

Update `docs/API_DOCUMENTATION.md` when adding/modifying endpoints.

### README Updates

Keep README.md current with:
- New features
- Changed dependencies
- Updated setup instructions

---

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Join our Discord for chat
- Email: dev@aistockplatform.com

---

Thank you for contributing! 🎉
