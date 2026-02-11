# Contributing to Fluent

Thank you for your interest in making technology more accessible! We welcome contributions from everyone.

## Code of Conduct

- Be respectful and inclusive
- Prioritize accessibility in all changes
- Assume positive intent
- Help others learn and grow

## How to Contribute

### 🐛 Report Bugs

1. Check [existing issues](https://github.com/jasonmatthewsuhari/ntu-beyond-binary/issues) first
2. Create a new issue with:
   - Clear title describing the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Python version, Node version)
   - Screenshots/logs if applicable

### 💡 Suggest Features

1. Check [existing discussions](https://github.com/jasonmatthewsuhari/ntu-beyond-binary/discussions)
2. Create a new discussion describing:
   - The accessibility problem you're solving
   - Your proposed solution
   - How it helps users with disabilities
   - Alternative approaches considered

### 🔧 Submit Code Changes

#### First Time Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ntu-beyond-binary.git
   cd ntu-beyond-binary
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ntu-beyond-binary.git
   ```

4. **Run setup:**
   ```bash
   # Windows
   setup.bat
   
   # macOS/Linux
   chmod +x setup.sh && ./setup.sh
   ```

#### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes:**
   - Follow code style guidelines (see below)
   - Add comments explaining complex logic
   - Update documentation if needed

3. **Test thoroughly:**
   ```bash
   # Test backend changes
   cd backend
   python src/server.py
   # Try the affected functionality
   
   # Test frontend changes
   cd frontend
   npm run dev
   # Try the affected UI
   ```

4. **Commit with clear messages:**
   ```bash
   git add .
   git commit -m "feat: Add braille display support"
   ```
   
   Use conventional commit format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Formatting, no code change
   - `refactor:` Code restructuring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request:**
   - Go to your fork on GitHub
   - Click "Pull Request"
   - Fill in the template (what, why, how to test)
   - Link related issues

#### Pull Request Guidelines

- **One feature per PR** - Don't combine unrelated changes
- **Write clear descriptions** - Explain what and why
- **Include tests** - If adding new functionality
- **Update documentation** - README, comments, etc.
- **Follow accessibility standards** - WCAG AA minimum
- **Test with real devices** - Camera, microphone, etc.
- **Respond to feedback** - Be open to suggestions

## Code Style Guidelines

### Python (Backend)

```python
# Use type hints
def process_input(data: dict, profile_id: str) -> str:
    """
    Process input data and return natural language query.
    
    Args:
        data: Input data dictionary
        profile_id: User profile identifier
        
    Returns:
        Natural language query string
    """
    pass

# Use descriptive variable names
user_calibration_data = load_calibration(profile_id)
transformation_matrix = calculate_transform(user_calibration_data)

# Follow PEP 8
# Use 4 spaces for indentation
# Max line length: 88 (Black formatter default)
# Imports: standard library, third-party, local

# Format with Black
pip install black
black backend/src/
```

### TypeScript/React (Frontend)

```typescript
// Use TypeScript for type safety
interface InputData {
  type: string
  timestamp: string
  confidence: number
}

// Functional components with proper typing
const InputMethod: React.FC<InputMethodProps> = ({ mode, onData }) => {
  const [connected, setConnected] = useState(false)
  
  return (
    <div className="input-method">
      {/* Component JSX */}
    </div>
  )
}

// Use descriptive names
const handleWebSocketMessage = (event: MessageEvent) => {
  // Handler logic
}

// Use Prettier for formatting
npm install --save-dev prettier
npm run format
```

### Accessibility Guidelines

**Every UI component must:**

1. **Keyboard Accessible**
   - Tab navigation works
   - Enter/Space activates buttons
   - Escape closes modals
   - Focus visible (outline)

2. **Screen Reader Friendly**
   ```tsx
   <button aria-label="Start voice input">
     <MicrophoneIcon aria-hidden="true" />
   </button>
   ```

3. **High Contrast**
   - Text: 4.5:1 minimum (7:1 preferred)
   - Large text: 3:1 minimum
   - Use WebAIM contrast checker

4. **Touch Targets**
   - Minimum 44x44 pixels
   - Adequate spacing between targets

5. **Error Messages**
   ```tsx
   <div role="alert" aria-live="polite">
     {error && <p>{error}</p>}
   </div>
   ```

6. **Semantic HTML**
   - Use `<button>` not `<div onClick>`
   - Use `<nav>`, `<main>`, `<section>`
   - Use headings hierarchically

## Adding a New Input Method

See [README.md → Development → Adding a New Input Method](README.md#adding-a-new-input-method) for detailed instructions.

**Checklist for new input methods:**

- [ ] Backend translation module (`backend/src/translate/method/`)
- [ ] WebSocket handler in `server.py`
- [ ] Frontend page (`frontend/app/input/method/page.tsx`)
- [ ] Icon and navigation entry
- [ ] Settings/calibration UI (if needed)
- [ ] Accessibility testing (keyboard, screen reader)
- [ ] Documentation (README, comments)
- [ ] Test with actual input device

## Testing Guidelines

### Manual Testing

1. **Test the happy path:**
   - Normal usage scenarios
   - Expected inputs and outputs

2. **Test edge cases:**
   - Empty inputs
   - Very long inputs
   - Rapid repeated inputs
   - Connection failures

3. **Test accessibility:**
   - Keyboard-only navigation
   - Screen reader (NVDA, JAWS, VoiceOver)
   - High contrast mode
   - Zoom to 200%

4. **Test cross-platform:**
   - Windows
   - macOS
   - Linux (if possible)

### With Real Users

If possible, test with people who have disabilities:

- Various motor impairments
- Visual impairments
- Hearing impairments
- Cognitive differences

Observe:
- What's confusing?
- What's frustrating?
- What works well?
- What's missing?

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.py              # FastAPI server
│   │   ├── agent_interface.py     # Desktop agent
│   │   ├── storage/               # Data persistence
│   │   └── translate/             # Input modules
│   └── requirements.txt           # Python deps
│
├── frontend/
│   ├── app/                       # Next.js pages
│   ├── components/                # React components
│   ├── electron/                  # Electron main/preload
│   └── package.json               # npm deps
│
├── README.md                      # Main documentation
├── QUICK_START.md                 # Setup guide
└── CONTRIBUTING.md                # This file
```

## Getting Help

- **Questions?** Open a [Discussion](https://github.com/jasonmatthewsuhari/ntu-beyond-binary/discussions)
- **Stuck?** Ask in your Pull Request
- **Found a bug?** Open an [Issue](https://github.com/jasonmatthewsuhari/ntu-beyond-binary/issues)

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](CONTRIBUTORS.md) - All contributors listed
- GitHub's Contributors page
- Release notes for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make technology accessible to everyone!** 🎉

Every contribution, no matter how small, makes a difference.
