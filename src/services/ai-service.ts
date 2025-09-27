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
    
    // Use the most capable model for better content variety
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro', // Use Pro model for better creativity and uniqueness
      generationConfig: {
        temperature: 0.9, // Higher temperature for more creative/unique responses
        topK: 60,         // Increased for more variety
        topP: 0.9,        // Slightly lower for better quality while maintaining creativity
        maxOutputTokens: 2048,
      }
    })
  }

  /**
   * Generate personalized wellness tips based on user profile
   */
  async generateWellnessTips(request: GenerationRequest): Promise<APIResponse<WellnessTip[]>> {
    try {
      const { profile } = request
      const prompt = this.buildWellnessPrompt(profile)
      
      console.log('🤖 Generating fresh wellness tips for:', profile.goals.map(g => g.name).join(', '))
      
      // Add timeout and retry logic
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      )
      
      const generatePromise = this.model.generateContent(prompt)
      
      const result = await Promise.race([generatePromise, timeoutPromise]) as any
      const response = await result.response
      const text = response.text()
      
      const tips = this.parseWellnessTipsResponse(text, profile)
      
      console.log(`✅ Generated ${tips.length} unique tips:`, tips.map(t => t.title))
      
      return {
        success: true,
        data: tips,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('❌ AI generation failed, using fallback tips')
      
      const fallbackTips = this.getFallbackTips(request.profile)
      
      return {
        success: true,
        data: fallbackTips,
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
    const goalCategories = [...new Set(profile.goals.map(g => g.category))].join(', ')
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Strong uniqueness
    
    return `You are an expert wellness coach. Generate 5 completely UNIQUE and FRESH wellness recommendations.

IMPORTANT: Generate ORIGINAL content each time - no repetitive or generic advice.

User Profile:
- Age: ${profile.age} (${ageGroup})  
- Gender: ${profile.gender}
- Specific Goals: ${goalsList}
- Categories: ${goalCategories}
- Session: ${uniqueId}

Requirements:
1. Each tip must DIRECTLY target these specific goals: ${goalsList}
2. Create 5 DISTINCT recommendations - no similar or overlapping advice
3. Make each tip actionable, specific, and evidence-based
4. Tailor advice for ${profile.gender} ${ageGroup} demographic  
5. Ensure variety across different aspects of wellness
6. Avoid generic wellness advice - be specific and innovative

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
        id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
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
  private parseTipDetailsResponse(text: string, originalTip: WellnessTip, _profile: UserProfile): WellnessTip {
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
        fullDescription: `${originalTip.title} is a powerful wellness practice that can significantly improve your health and well-being. This evidence-based recommendation is tailored to your goals and can help you build sustainable healthy habits. Regular implementation of this practice leads to better physical health, improved mental clarity, and enhanced overall quality of life. The benefits compound over time, making this an excellent investment in your long-term wellness journey.`,
        steps: [
          `Begin by understanding why ${originalTip.title.toLowerCase()} is important for your wellness goals`,
          'Set aside dedicated time in your schedule for this practice',
          'Start with small, manageable actions that fit into your daily routine',
          'Track your progress and celebrate small wins along the way',
          'Gradually increase the intensity or frequency as you build the habit',
          'Make adjustments based on how your body and mind respond',
          'Stay consistent for at least 21 days to establish the habit',
          'Seek support from friends, family, or wellness communities when needed'
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
   * Provide fallback tips if AI generation fails - personalized to user's goals
   */
  private getFallbackTips(profile: UserProfile): WellnessTip[] {
    const goalCategories = profile.goals.map(g => g.category)
    const goalNames = profile.goals.map(g => g.id)
    
    const allFallbackTips: Array<Omit<WellnessTip, 'id' | 'createdAt' | 'aiGeneratedFor'> & { relevantGoals?: string[] }> = [
      // Fitness tips
      {
        title: 'Quick Morning Cardio',
        shortDescription: 'Start your day with 10 minutes of energy-boosting movement.',
        category: 'fitness',
        icon: '🏃‍♂️',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        benefits: ['Improved cardiovascular health', 'Increased energy', 'Better mood'],
        tags: ['cardio', 'morning', 'energy'],
        isFavorite: false,
        relevantGoals: ['cardio-fitness', 'energy-boost', 'weight-management']
      },
      {
        title: 'Bodyweight Strength Training',
        shortDescription: 'Build muscle with simple exercises you can do anywhere.',
        category: 'fitness',
        icon: '💪',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        benefits: ['Increased muscle mass', 'Better metabolism', 'Stronger bones'],
        tags: ['strength', 'bodyweight', 'muscle'],
        isFavorite: false,
        relevantGoals: ['muscle-building', 'weight-management']
      },
      {
        title: 'Daily Flexibility Routine',
        shortDescription: 'Improve mobility and reduce stiffness with gentle stretches.',
        category: 'fitness',
        icon: '🤸',
        difficulty: 'easy',
        estimatedTime: '15 minutes',
        benefits: ['Improved flexibility', 'Reduced stiffness', 'Better posture'],
        tags: ['flexibility', 'stretching', 'mobility'],
        isFavorite: false,
        relevantGoals: ['flexibility']
      },

      // Nutrition tips
      {
        title: 'Balanced Plate Method',
        shortDescription: 'Create nutritious meals using the simple plate division rule.',
        category: 'nutrition',
        icon: '🥗',
        difficulty: 'easy',
        estimatedTime: '5 minutes planning',
        benefits: ['Better nutrition', 'Portion control', 'Sustained energy'],
        tags: ['meal-planning', 'nutrition', 'balance'],
        isFavorite: false,
        relevantGoals: ['healthy-eating', 'weight-management']
      },
      {
        title: 'Weekly Meal Prep',
        shortDescription: 'Save time and eat healthier with organized meal preparation.',
        category: 'nutrition',
        icon: '📝',
        difficulty: 'medium',
        estimatedTime: '2 hours weekly',
        benefits: ['Time savings', 'Better nutrition', 'Cost savings'],
        tags: ['meal-prep', 'planning', 'organization'],
        isFavorite: false,
        relevantGoals: ['meal-planning', 'healthy-eating']
      },
      {
        title: 'Smart Hydration System',
        shortDescription: 'Track and optimize your daily water intake easily.',
        category: 'nutrition',
        icon: '💧',
        difficulty: 'easy',
        estimatedTime: '2 minutes setup',
        benefits: ['Better hydration', 'Improved energy', 'Clearer skin'],
        tags: ['hydration', 'water', 'tracking'],
        isFavorite: false,
        relevantGoals: ['hydration']
      },
      {
        title: 'Gut Health Support',
        shortDescription: 'Improve digestion with probiotic-rich foods and fiber.',
        category: 'nutrition',
        icon: '🌿',
        difficulty: 'medium',
        estimatedTime: '10 minutes daily',
        benefits: ['Better digestion', 'Improved immunity', 'Enhanced nutrient absorption'],
        tags: ['gut-health', 'probiotics', 'digestion'],
        isFavorite: false,
        relevantGoals: ['digestive-health']
      },

      // Mental Health tips
      {
        title: 'Mindfulness Moments',
        shortDescription: 'Practice present-moment awareness throughout your day.',
        category: 'mental-health',
        icon: '�',
        difficulty: 'easy',
        estimatedTime: '5 minutes',
        benefits: ['Reduced stress', 'Better focus', 'Emotional balance'],
        tags: ['mindfulness', 'meditation', 'awareness'],
        isFavorite: false,
        relevantGoals: ['mindfulness', 'stress-reduction']
      },
      {
        title: 'Anxiety Relief Techniques',
        shortDescription: 'Learn practical strategies to manage anxious thoughts.',
        category: 'mental-health',
        icon: '🌱',
        difficulty: 'medium',
        estimatedTime: '10-15 minutes',
        benefits: ['Reduced anxiety', 'Better emotional control', 'Improved confidence'],
        tags: ['anxiety', 'coping', 'mental-health'],
        isFavorite: false,
        relevantGoals: ['anxiety-management', 'stress-reduction']
      },

      // Sleep tips
      {
        title: 'Optimal Sleep Routine',
        shortDescription: 'Create a consistent bedtime routine for better rest.',
        category: 'sleep',
        icon: '😴',
        difficulty: 'medium',
        estimatedTime: '30 minutes prep',
        benefits: ['Better sleep quality', 'More energy', 'Improved mood'],
        tags: ['sleep', 'routine', 'rest'],
        isFavorite: false,
        relevantGoals: ['better-sleep']
      },

      // Stress Management tips
      {
        title: 'Work-Life Boundaries',
        shortDescription: 'Create healthy separation between work and personal time.',
        category: 'stress-management',
        icon: '⚖️',
        difficulty: 'medium',
        estimatedTime: '15 minutes setup',
        benefits: ['Reduced stress', 'Better relationships', 'Improved productivity'],
        tags: ['balance', 'boundaries', 'work-life'],
        isFavorite: false,
        relevantGoals: ['work-life-balance', 'stress-reduction']
      },
      {
        title: 'Digital Wellness Break',
        shortDescription: 'Reduce screen time stress with mindful technology use.',
        category: 'stress-management',
        icon: '📱',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        benefits: ['Reduced eye strain', 'Better focus', 'Improved sleep'],
        tags: ['digital-detox', 'technology', 'mindfulness'],
        isFavorite: false,
        relevantGoals: ['stress-reduction', 'better-sleep']
      },

      // Preventive Care tips
      {
        title: 'Immune System Boost',
        shortDescription: 'Strengthen your natural defenses with simple daily habits.',
        category: 'preventive-care',
        icon: '🛡️',
        difficulty: 'easy',
        estimatedTime: '5 minutes daily',
        benefits: ['Stronger immunity', 'Fewer illnesses', 'Faster recovery'],
        tags: ['immunity', 'prevention', 'health'],
        isFavorite: false,
        relevantGoals: ['immune-system']
      }
    ]

    // Filter tips based on user's goals, then fill with general tips if needed
    const relevantTips = allFallbackTips.filter(tip => 
      (tip as any).relevantGoals?.some((goal: string) => goalNames.includes(goal))
    )
    
    // Add general tips if we don't have enough relevant ones
    const generalTips = allFallbackTips.filter(tip => 
      !(tip as any).relevantGoals || goalCategories.includes(tip.category)
    )
    
    const selectedTips = [...relevantTips, ...generalTips].slice(0, 5)

    return selectedTips.map((tip, index) => {
      // Remove the relevantGoals property when creating the final object
      const { relevantGoals, ...tipWithoutRelevantGoals } = tip
      return {
        ...tipWithoutRelevantGoals,
        id: `fallback-tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
        createdAt: new Date(),
        aiGeneratedFor: profile
      }
    })
  }
}

// Export singleton instance
export const aiService = new AIService()