# 🌟 AI Wellness Board

A production-level, personalized wellness recommendation platform powered by Google Gemini AI. Get tailored health tips based on your age, gender, and wellness goals with an intuitive, responsive interface.

![AI Wellness Board](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-38bdf8)
![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-4285f4)

## 🚀 Live Demo

**[Visit AI Wellness Board](https://ai-wellness-board.vercel.app)** *(Replace with your actual deployment URL)*

## 📱 Features

### Core Functionality
- **👤 Smart Profile Setup**: Age, gender, and goal-based personalization
- **🤖 AI-Generated Tips**: 5 personalized wellness recommendations per session
- **📋 Detailed Guidance**: Step-by-step implementation instructions
- **⭐ Favorites System**: Save and organize preferred tips
- **🔄 Regeneration**: Get fresh recommendations anytime
- **📱 Responsive Design**: Seamless experience across all devices

### Technical Excellence
- **⚡ Performance Optimized**: Fast loading with Next.js 14 App Router
- **🎨 Beautiful UI/UX**: Framer Motion animations and Tailwind CSS
- **💾 Persistent Storage**: LocalStorage integration for user data
- **🛡️ Error Handling**: Comprehensive error boundaries and fallbacks
- **🔒 Type Safety**: Full TypeScript implementation
- **♿ Accessibility**: WCAG compliant design patterns

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14**: App Router, Server Components, TypeScript
- **React 18**: Hooks, Context API, Component composition
- **TypeScript**: Strict type checking and interfaces

### Styling & Animation
- **Tailwind CSS**: Utility-first CSS with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful, customizable icons

### AI Integration
- **Google Gemini Pro**: Advanced natural language processing
- **Custom Prompting**: Optimized prompts for wellness recommendations
- **Fallback System**: Graceful degradation with preset tips

### State Management
- **React Context**: Global application state
- **LocalStorage**: Client-side persistence
- **Custom Hooks**: Reusable state logic

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality assurance
- **Jest**: Unit testing framework

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application entry point
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── profile-setup.tsx # Multi-step profile configuration
│   ├── wellness-board.tsx# Main tips display
│   ├── tip-details.tsx   # Detailed tip view
│   ├── favorites-list.tsx# Saved tips management
│   └── navbar.tsx        # Navigation component
├── services/             # External service integrations
│   └── ai-service.ts     # Google Gemini AI client
├── store/                # State management
│   └── wellness-context.tsx # React Context provider
├── types/                # TypeScript definitions
│   └── wellness.ts       # Core type definitions
├── constants/            # Application constants
│   └── wellness.ts       # Goals, categories, colors
└── lib/                  # Utility functions
    └── utils.ts          # Helper functions
```

### State Flow
1. **Profile Setup** → User input collection and validation
2. **AI Generation** → Gemini API call with personalized prompts
3. **Tips Display** → Interactive card-based presentation
4. **Persistence** → LocalStorage for favorites and profile
5. **Navigation** → Context-driven route management

### Component Architecture
- **Container Components**: Handle logic and state management
- **Presentation Components**: Pure UI rendering
- **Custom Hooks**: Reusable stateful logic
- **Context Providers**: Global state distribution

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-wellness-board.git
   cd ai-wellness-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_NAME="AI Wellness Board"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run tests
npm test
```

## 🤖 AI Integration Guide

### Prompt Engineering

The application uses sophisticated prompts to generate personalized wellness tips:

#### Initial Prompt Structure
```typescript
const prompt = `You are an expert wellness coach and health advisor. Generate 5 personalized wellness recommendations for a ${age}-year-old ${gender} person with the following wellness goals: ${goals}.

Instructions:
1. Create 5 diverse, actionable wellness tips
2. Each tip should be practical, evidence-based, and achievable
3. Cover different categories: fitness, nutrition, mental health, sleep, stress management
4. Consider the person's life stage when making recommendations
5. Format as JSON with specific structure...`
```

#### Detailed Explanation Prompts
```typescript
const detailPrompt = `As an expert wellness coach, provide comprehensive explanation for implementing this wellness tip:

Tip: "${tipTitle}"
Target: ${age}-year-old ${gender} person
Goals: ${userGoals}

Provide:
1. Scientific explanation of benefits
2. Step-by-step implementation guide
3. Common challenges and solutions
4. Progress tracking methods...`
```

### API Response Handling
- **Structured JSON**: Consistent response format
- **Fallback System**: Preset tips if API fails
- **Validation**: Response structure verification
- **Error Recovery**: Graceful degradation

## 📊 User Experience Flow

### 1. Profile Capture Screen
- **Age Input**: Numeric validation (13-120)
- **Gender Selection**: Inclusive options with accessibility
- **Goal Selection**: Up to 5 from 15 predefined categories
- **Progressive Enhancement**: Step-by-step validation

### 2. AI Generation Process
- **Loading Animation**: Engaging progress indicators
- **Real-time Updates**: Status messages during generation
- **Error Handling**: Clear feedback and retry options
- **Performance Optimization**: Request caching and retries

### 3. Tips Display Board
- **Card-Based Layout**: Visual hierarchy and scannable design
- **Interactive Elements**: Hover states and click feedback
- **Filtering Options**: Category and difficulty badges
- **Quick Actions**: Favorite toggling and navigation

### 4. Detailed Tip View
- **Comprehensive Information**: Full descriptions and benefits
- **Step-by-Step Guides**: Actionable implementation plans
- **Progress Tracking**: Checkboxes for step completion
- **Related Recommendations**: Cross-promotion of other tips

### 5. Favorites Management
- **Persistent Storage**: LocalStorage with fallback
- **Organization Tools**: Category grouping and statistics
- **Bulk Actions**: Multi-select operations
- **Export Options**: Future enhancement for data portability

## 🔧 Customization

### Design System
The application uses a custom design system built on Tailwind CSS:

```css
/* Custom color palette */
:root {
  --wellness-50: #f0fdfa;
  --wellness-100: #ccfbf1;
  --wellness-500: #14b8a6;
  --wellness-600: #0d9488;
  /* ... */
}
```

### Component Theming
- **Consistent Colors**: Semantic color usage throughout
- **Responsive Breakpoints**: Mobile-first design approach
- **Animation Timing**: Coordinated motion design
- **Typography Scale**: Harmonious text sizing

### Adding New Goals
1. Update `WELLNESS_GOALS` in `src/constants/wellness.ts`
2. Add corresponding icons and descriptions
3. Update TypeScript types if needed
4. Test AI prompt generation with new categories

## 🧪 Testing Strategy

### Unit Testing
- **Component Testing**: React Testing Library
- **Hook Testing**: Custom hook isolation
- **Utility Testing**: Pure function validation
- **Mock Integration**: External service mocking

### Integration Testing
- **User Flow Testing**: End-to-end scenarios
- **API Integration**: Gemini service testing
- **State Management**: Context provider testing
- **LocalStorage**: Persistence layer validation

### Performance Testing
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Analysis**: Code splitting optimization
- **Memory Usage**: Component lifecycle management
- **Network Efficiency**: API call optimization

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure automatic deployments

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
   NEXT_PUBLIC_APP_NAME=AI Wellness Board
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Build Configuration**
   - Next.js build automatically optimized
   - Static assets served via CDN
   - Serverless functions for API routes

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Manual Deployment
```bash
# Build the application
npm run build

# Copy build files to server
rsync -avz .next/ user@server:/path/to/app/

# Start production server
npm start
```

## 🔒 Security & Privacy

### Data Protection
- **Client-Side Storage**: No sensitive data sent to servers
- **API Key Security**: Environment variable protection
- **Input Validation**: Comprehensive sanitization
- **HTTPS Enforcement**: Secure communication channels

### Privacy Considerations
- **No User Tracking**: Privacy-first approach
- **Local Storage Only**: No external data collection
- **Anonymous AI Requests**: No personally identifiable information
- **Transparent Processing**: Clear data usage explanation

## 🐛 Known Issues & Improvements

### Current Limitations
1. **Offline Support**: Add service worker for offline functionality
2. **Data Export**: Implement favorites export/import feature
3. **Social Sharing**: Add tip sharing capabilities
4. **Analytics Integration**: Optional usage tracking
5. **Multi-language**: Internationalization support

### Future Enhancements
- **Advanced Personalization**: Machine learning integration
- **Progress Tracking**: Long-term goal monitoring
- **Community Features**: User-generated content
- **Wearable Integration**: Health data synchronization
- **Nutrition Database**: Meal planning integration

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Consistent formatting
- **Testing**: Maintain >80% coverage
- **Documentation**: Update README for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini**: AI-powered recommendation engine
- **Vercel**: Deployment and hosting platform
- **Next.js Team**: Outstanding React framework
- **Tailwind CSS**: Beautiful utility-first styling
- **Framer Motion**: Smooth animation library
- **Radix UI**: Accessible component primitives

## 📞 Support & Contact

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-wellness-board/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-wellness-board/discussions)
- **Documentation**: This README and inline code comments

### Author
**Tushar** - [GitHub Profile](https://github.com/Tushar3330)

---

<div align="center">

**Made with ❤️ for better wellness experiences**

[⭐ Star this project](https://github.com/yourusername/ai-wellness-board) if you found it helpful!

</div>