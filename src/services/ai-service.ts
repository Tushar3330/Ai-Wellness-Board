import { GoogleGenerativeAI } from '@google/generative-ai'
import type { 
  UserProfile, 
  WellnessTip, 
  GoalCategory, 
  GenerationRequest, 
  APIResponse 
} from '@/types/wellness'

class AIService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Gemini API key is required')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  /**
   * Generate personalized wellness tips based on user profile
   */
  async generateWellnessTips(request: GenerationRequest): Promise<APIResponse<WellnessTip[]>> {
    try {
      const { profile } = request
      const prompt = this.buildWellnessPrompt(profile)
      
      console.log('Generating tips with prompt:', prompt)
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const tips = this.parseWellnessTipsResponse(text, profile)
      
      return {
        success: true,
        data: tips,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Error generating wellness tips:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate tips',
        timestamp: new Date()
      }
    }
  }

  /**
   * Generate detailed explanation for a specific tip
   */
  async generateTipDetails(tip: WellnessTip, profile: UserProfile): Promise<APIResponse<WellnessTip>> {
    try {
      const prompt = this.buildTipDetailsPrompt(tip, profile)
      
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const detailedTip = this.parseTipDetailsResponse(text, tip, profile)
      
      return {
        success: true,
        data: detailedTip,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Error generating tip details:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate tip details',
        timestamp: new Date()
      }
    }
  }

  /**
   * Build the main wellness tips generation prompt
   */
  private buildWellnessPrompt(profile: UserProfile): string {
    const ageGroup = this.getAgeGroup(profile.age)
    const goalsList = profile.goals.map(g => g.name).join(', ')
    
    return `You are an expert wellness coach and health advisor. Generate 5 personalized wellness recommendations for a ${profile.age}-year-old ${profile.gender} person with the following wellness goals: ${goalsList}.

Instructions:
1. Create 5 diverse, actionable wellness tips that are specifically tailored to this person's age, gender, and goals
2. Each tip should be practical, evidence-based, and achievable
3. Cover different categories: fitness, nutrition, mental health, sleep, and stress management
4. Consider the person's life stage (${ageGroup}) when making recommendations
5. Format your response as a JSON array with the exact structure below

Required JSON format:
[
  {
    "title": "Concise, engaging tip title (max 60 characters)",
    "shortDescription": "Brief 2-sentence summary highlighting the main benefit (max 150 characters)",
    "category": "fitness|nutrition|mental-health|sleep|stress-management",
    "icon": "💪|🥗|🧠|😴|🧘|❤️|🏃‍♂️|🥑|📱|⚡",
    "difficulty": "easy|medium|hard",
    "estimatedTime": "e.g., '5 minutes', '15-20 minutes', '30 seconds'",
    "benefits": ["benefit 1", "benefit 2", "benefit 3"],
    "tags": ["relevant", "tags", "for", "this", "tip"]
  }
]

Important guidelines:
- Make tips specific to ${profile.gender} ${ageGroup} individuals
- Ensure recommendations are safe and appropriate for the age group
- Include a mix of quick wins (easy) and more substantial changes (medium/hard)
- Use encouraging, positive language
- Choose appropriate emojis that match the tip category
- Benefits should be specific and motivating
- Tags should be relevant keywords for filtering/searching

Generate exactly 5 tips now:`
  }

  /**
   * Build the detailed tip explanation prompt
   */
  private buildTipDetailsPrompt(tip: WellnessTip, profile: UserProfile): string {
    return `As an expert wellness coach, provide a comprehensive explanation and step-by-step guide for implementing this wellness tip:

Tip Title: "${tip.title}"
Short Description: "${tip.shortDescription}"
Category: ${tip.category}
Target Audience: ${profile.age}-year-old ${profile.gender} person
User Goals: ${profile.goals.map(g => g.name).join(', ')}

Please provide:
1. A detailed explanation of WHY this tip is important (science-backed benefits)
2. Specific step-by-step instructions for implementation
3. Potential challenges and how to overcome them
4. Ways to track progress or measure success
5. Modifications for different fitness/experience levels

Format your response as JSON with this exact structure:
{
  "fullDescription": "Comprehensive 3-4 paragraph explanation covering the science, benefits, and importance of this recommendation for this specific person",
  "steps": [
    "Step 1: Clear, specific instruction",
    "Step 2: Next actionable step",
    "Step 3: Continue with detailed steps...",
    "Step N: Final step or maintenance advice"
  ]
}

Important:
- Personalize advice for a ${profile.age}-year-old ${profile.gender} individual
- Include specific numbers, timeframes, and measurable outcomes where possible
- Address common obstacles someone in this demographic might face
- Provide motivation and encouragement throughout
- Ensure all advice is evidence-based and safe

Generate the detailed response now:`
  }

  /**
   * Parse the AI response into WellnessTip objects
   */
  private parseWellnessTipsResponse(text: string, profile: UserProfile): WellnessTip[] {
    try {
      // Clean the response text
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      const tipsData = JSON.parse(cleanText)
      
      if (!Array.isArray(tipsData)) {
        throw new Error('Response is not an array')
      }

      return tipsData.map((tipData: any, index: number): WellnessTip => ({
        id: `tip-${Date.now()}-${index}`,
        title: tipData.title || `Wellness Tip ${index + 1}`,
        shortDescription: tipData.shortDescription || 'No description available',
        category: this.validateCategory(tipData.category) || 'fitness',
        icon: tipData.icon || '💪',
        difficulty: tipData.difficulty || 'easy',
        estimatedTime: tipData.estimatedTime || '5 minutes',
        benefits: Array.isArray(tipData.benefits) ? tipData.benefits : ['Improved wellness'],
        tags: Array.isArray(tipData.tags) ? tipData.tags : ['wellness'],
        isFavorite: false,
        createdAt: new Date(),
        aiGeneratedFor: profile
      }))
    } catch (error) {
      console.error('Error parsing wellness tips response:', error)
      // Return fallback tips if parsing fails
      return this.getFallbackTips(profile)
    }
  }

  /**
   * Parse the detailed tip response
   */
  private parseTipDetailsResponse(text: string, originalTip: WellnessTip, profile: UserProfile): WellnessTip {
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const detailsData = JSON.parse(cleanText)
      
      return {
        ...originalTip,
        fullDescription: detailsData.fullDescription || 'Detailed information not available.',
        steps: Array.isArray(detailsData.steps) ? detailsData.steps : []
      }
    } catch (error) {
      console.error('Error parsing tip details response:', error)
      return {
        ...originalTip,
        fullDescription: 'This is a valuable wellness tip that can help improve your overall health and well-being. Regular implementation of healthy habits leads to better physical and mental outcomes.',
        steps: [
          'Start by setting aside dedicated time for this activity',
          'Begin with small, manageable steps',
          'Track your progress daily',
          'Gradually increase intensity or duration',
          'Make it a consistent part of your routine'
        ]
      }
    }
  }

  /**
   * Validate category input
   */
  private validateCategory(category: string): GoalCategory | null {
    const validCategories: GoalCategory[] = [
      'fitness', 'nutrition', 'mental-health', 'sleep', 'stress-management', 'preventive-care'
    ]
    return validCategories.includes(category as GoalCategory) ? category as GoalCategory : null
  }

  /**
   * Get age group classification
   */
  private getAgeGroup(age: number): string {
    if (age < 18) return 'teenager'
    if (age < 25) return 'young adult'
    if (age < 35) return 'adult'
    if (age < 50) return 'middle-aged adult'
    if (age < 65) return 'older adult'
    return 'senior'
  }

  /**
   * Provide fallback tips if AI generation fails
   */
  private getFallbackTips(profile: UserProfile): WellnessTip[] {
    const fallbackTips: Omit<WellnessTip, 'id' | 'createdAt' | 'aiGeneratedFor'>[] = [
      {
        title: 'Daily 10-Minute Walk',
        shortDescription: 'Boost energy and mood with a short daily walk. Perfect for any fitness level.',
        category: 'fitness',
        icon: '🚶‍♂️',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        benefits: ['Improved cardiovascular health', 'Better mood', 'Increased energy'],
        tags: ['walking', 'cardio', 'beginner-friendly'],
        isFavorite: false
      },
      {
        title: 'Hydration Reminder System',
        shortDescription: 'Stay properly hydrated with a simple water tracking method.',
        category: 'nutrition',
        icon: '💧',
        difficulty: 'easy',
        estimatedTime: '2 minutes setup',
        benefits: ['Better skin health', 'Improved energy', 'Enhanced focus'],
        tags: ['hydration', 'water', 'health'],
        isFavorite: false
      },
      {
        title: '5-Minute Breathing Exercise',
        shortDescription: 'Reduce stress instantly with guided breathing techniques.',
        category: 'mental-health',
        icon: '🧘',
        difficulty: 'easy',
        estimatedTime: '5 minutes',
        benefits: ['Reduced anxiety', 'Better focus', 'Improved mood'],
        tags: ['breathing', 'meditation', 'stress-relief'],
        isFavorite: false
      },
      {
        title: 'Consistent Sleep Schedule',
        shortDescription: 'Optimize rest with a regular bedtime routine.',
        category: 'sleep',
        icon: '😴',
        difficulty: 'medium',
        estimatedTime: '30 minutes prep',
        benefits: ['Better sleep quality', 'Improved energy', 'Enhanced immunity'],
        tags: ['sleep', 'routine', 'recovery'],
        isFavorite: false
      },
      {
        title: 'Digital Wellness Break',
        shortDescription: 'Reduce screen time stress with mindful technology use.',
        category: 'stress-management',
        icon: '📱',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        benefits: ['Reduced eye strain', 'Better focus', 'Improved relationships'],
        tags: ['digital-detox', 'mindfulness', 'balance'],
        isFavorite: false
      }
    ]

    return fallbackTips.map((tip, index) => ({
      ...tip,
      id: `fallback-tip-${index}`,
      createdAt: new Date(),
      aiGeneratedFor: profile
    }))
  }
}

// Export singleton instance
export const aiService = new AIService()