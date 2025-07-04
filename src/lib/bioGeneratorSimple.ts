// GoViral Instagram Bio Generator - AI-Powered Bio Creation
// Following successful patterns from hashtag analyzer

import OpenAI from 'openai';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export interface BioContext {
  accountType: 'personal' | 'business' | 'influencer' | 'artist' | 'creator';
  niche: string;
  targetAudience: string;
  primaryGoal: 'followers' | 'sales' | 'branding' | 'community' | 'awareness';
  personalityTone: 'professional' | 'casual' | 'funny' | 'inspirational' | 'edgy';
  servicesProducts?: string;
  website?: string;
  location?: string;
  languagePreference?: 'spanish' | 'english' | 'both';
}

export interface GeneratedBio {
  id: string;
  bioText: string;
  bioType: 'minimalist' | 'emoji_rich' | 'list_format' | 'storytelling' | 'cta_focused';
  characterCount: number;
  emojiCount: number;
  hasCallToAction: boolean;
  keywords: string[];
  reasoning: string;
}

export interface BioGenerationResult {
  generatedBios: GeneratedBio[];
  contextAnalysis: {
    nicheInsights: string;
    audienceRecommendations: string;
    competitorTips: string;
    optimizationSuggestions: string[];
  };
  bestPractices: {
    characterLimit: string;
    emojiUsage: string;
    ctaPlacement: string;
    keywordStrategy: string;
  };
  generatedAt: string;
}

// ===============================================
// INSTAGRAM BIO GENERATOR SERVICE
// ===============================================

export class InstagramBioGeneratorService {
  private _openai: OpenAI | null = null;
  
  private get openai(): OpenAI {
    if (!this._openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      this._openai = new OpenAI({ apiKey });
    }
    return this._openai;
  }

  /**
   * Main entry point: Generate multiple bio variations
   */
  async generateBios(context: BioContext): Promise<BioGenerationResult | null> {
    try {
      console.log(`🚀 Starting bio generation for ${context.niche} ${context.accountType}`);
      
      // Step 1: Generate multiple bio variations with OpenAI
      const generatedBios = await this.generateBioVariations(context);
      
      if (!generatedBios || generatedBios.length === 0) {
        throw new Error('Failed to generate bios with AI');
      }

      // Step 2: Analyze context and provide insights
      const contextAnalysis = await this.analyzeContextInsights(context);
      
      // Step 3: Generate best practices recommendations
      const bestPractices = this.generateBestPractices(context);
      
      // Step 4: Return comprehensive result
      const result: BioGenerationResult = {
        generatedBios,
        contextAnalysis,
        bestPractices,
        generatedAt: new Date().toISOString()
      };
      
      console.log('✅ Bio generation complete');
      return result;

    } catch (error) {
      console.error('❌ Error in bio generation:', error);
      return null;
    }
  }

  /**
   * Generate multiple bio variations using OpenAI
   */
  async generateBioVariations(context: BioContext): Promise<GeneratedBio[]> {
    console.log('🤖 Generating bio variations with OpenAI...');
    
    const bios: GeneratedBio[] = [];
    const bioTypes: GeneratedBio['bioType'][] = [
      'minimalist',
      'emoji_rich', 
      'list_format',
      'storytelling',
      'cta_focused'
    ];

    for (const bioType of bioTypes) {
      try {
        const prompt = this.buildBioPrompt(context, bioType);
        
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en marketing de Instagram y creación de biografías. Creas bios que convierten visitantes en seguidores y clientes. Especialista en mercado hispanohablante.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 300
        });

        const content = response.choices[0]?.message?.content;
        if (!content) continue;

        const generatedBio = this.processBioResponse(content, bioType, context);
        if (generatedBio) {
          bios.push(generatedBio);
        }

      } catch (error) {
        console.error(`❌ Error generating ${bioType} bio:`, error);
        continue;
      }
    }
    
    console.log(`📝 Generated ${bios.length} bio variations`);
    
    // Ensure we always have at least 3 bios by creating fallbacks if needed
    if (bios.length < 3) {
      console.log('🔧 Generating fallback bios to ensure minimum variety...');
      const missingTypes = bioTypes.filter(type => !bios.some(bio => bio.bioType === type));
      
      for (const bioType of missingTypes.slice(0, 3 - bios.length)) {
        const fallbackBio = this.createFallbackBio(context, bioType);
        if (fallbackBio) {
          bios.push(fallbackBio);
        }
      }
    }
    
    return bios;
  }

  /**
   * Analyze context and provide strategic insights
   */
  private async analyzeContextInsights(context: BioContext): Promise<BioGenerationResult['contextAnalysis']> {
    console.log('📊 Analyzing context for strategic insights...');
    
    // Generate insights based on context without OpenAI call to avoid timeout
    const nicheInsights = this.generateNicheInsights(context);
    const audienceRecommendations = this.generateAudienceRecommendations(context);
    const competitorTips = this.generateCompetitorTips(context);
    const optimizationSuggestions = this.generateOptimizationSuggestions(context);

    return {
      nicheInsights,
      audienceRecommendations,
      competitorTips,
      optimizationSuggestions
    };
  }

  /**
   * Generate niche-specific insights
   */
  private generateNicheInsights(context: BioContext): string {
    const nicheStrategies: Record<string, string> = {
      fitness: 'En fitness, muestra transformaciones y resultados. La motivación personal conecta más que solo ejercicios.',
      food: 'Para contenido gastronómico, combina recetas con historias personales. Los ingredientes locales generan más engagement.',
      travel: 'En viajes, enfócate en experiencias auténticas más que destinos famosos. Las historias humanas venden mejor.',
      fashion: 'En moda, muestra versatilidad y personalidad. Los outfits accesibles tienen más alcance que alta costura.',
      business: 'Para negocios, humaniza tu marca. Los clientes compran a personas, no a empresas.',
      lifestyle: 'En lifestyle, la autenticidad es clave. Comparte tanto éxitos como desafíos reales.',
      technology: 'En tech, simplifica conceptos complejos. Las aplicaciones prácticas resuenan más que la teoría.',
      art: 'En arte, muestra tu proceso creativo. La historia detrás de la obra conecta emocionalmente.',
      education: 'En educación, usa ejemplos concretos. El aprendizaje visual y las historias mejoran la retención.',
      health: 'En salud, enfócate en prevención y bienestar integral. Los pequeños cambios diarios son más sostenibles.'
    };

    const lowerNiche = context.niche.toLowerCase();
    for (const [key, insight] of Object.entries(nicheStrategies)) {
      if (lowerNiche.includes(key)) {
        return insight;
      }
    }

    return `En ${context.niche}, la clave es encontrar tu ángulo único y mantener consistencia en tu mensaje. La autenticidad genera más conexión que la perfección.`;
  }

  /**
   * Generate audience-specific recommendations
   */
  private generateAudienceRecommendations(context: BioContext): string {
    const goalStrategies: Record<typeof context.primaryGoal, string> = {
      followers: 'Para crecer en seguidores, usa CTAs como "Sígueme para más" y publica contenido que invite a guardar y compartir.',
      sales: 'Para ventas, incluye testimonios sutiles en tu bio y direcciona a tu link de contacto o tienda.',
      branding: 'Para branding personal, cuenta tu historia única y qué te diferencia en tu industria.',
      community: 'Para construir comunidad, invita a la participación con preguntas y crea contenido que genere conversación.',
      awareness: 'Para visibilidad, usa hashtags estratégicos y colabora con otros creadores de tu nicho.'
    };

    return `${goalStrategies[context.primaryGoal]} Tu audiencia (${context.targetAudience}) busca valor genuino y conexión auténtica.`;
  }

  /**
   * Generate competitor analysis tips
   */
  private generateCompetitorTips(context: BioContext): string {
    const accountTypeStrategies: Record<typeof context.accountType, string> = {
      personal: 'Para cuentas personales, observa cómo otros en tu nicho balancean contenido profesional y personal. La vulnerabilidad controlada genera engagement.',
      business: 'Para negocios, analiza cómo competidores exitosos humanizan su marca y comunican su propuesta de valor en pocas palabras.',
      influencer: 'Para influencers, estudia cómo los top creators de tu nicho estructuran sus bios para maximizar colaboraciones y conversiones.',
      artist: 'Para artistas, observa cómo otros muestran su estilo único y proceso creativo sin revelar demasiado.',
      creator: 'Para creators, analiza cómo los exitosos comunican su expertise y invitan a consumir más contenido.'
    };

    return accountTypeStrategies[context.accountType];
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizationSuggestions(context: BioContext): string[] {
    const baseOptimizations = [
      'Usa keywords de tu nicho para aparecer en búsquedas',
      'Incluye una llamada a la acción clara y específica',
      'Actualiza tu bio cada 2-3 meses con contenido fresco'
    ];

    const toneOptimizations: Record<typeof context.personalityTone, string[]> = {
      professional: [
        'Incluye logros o credenciales relevantes',
        'Usa un lenguaje claro y directo'
      ],
      casual: [
        'Agrega emojis que reflejen tu personalidad',
        'Usa un lenguaje conversacional y cercano'
      ],
      funny: [
        'Incluye un toque de humor que refleje tu contenido',
        'Usa emojis divertidos pero sin exagerar'
      ],
      inspirational: [
        'Incluye una frase motivacional que te represente',
        'Usa lenguaje que inspire acción'
      ],
      edgy: [
        'Sé auténtico y diferente, pero accesible',
        'Usa un lenguaje que intrigue sin alienar'
      ]
    };

    return [...baseOptimizations, ...toneOptimizations[context.personalityTone]];
  }

  /**
   * Generate best practices recommendations
   */
  private generateBestPractices(context: BioContext): BioGenerationResult['bestPractices'] {
    return {
      characterLimit: 'Instagram permite 150 caracteres. Usa cada uno estratégicamente.',
      emojiUsage: context.personalityTone === 'professional' 
        ? 'Usa emojis con moderación (1-3 máximo)'
        : 'Los emojis aumentan engagement. Usa 3-6 relevantes a tu nicho.',
      ctaPlacement: context.primaryGoal === 'sales'
        ? 'Coloca tu CTA al final con un emoji de flecha ⬇️'
        : 'Integra tu CTA naturalmente en el flujo del texto.',
      keywordStrategy: `Incluye 2-3 keywords de ${context.niche} para aparecer en búsquedas.`
    };
  }

  /**
   * Build specialized prompt for each bio type
   */
  private buildBioPrompt(context: BioContext, bioType: GeneratedBio['bioType']): string {
    const baseContext = `
Tipo de cuenta: ${context.accountType}
Nicho: ${context.niche}
Audiencia objetivo: ${context.targetAudience}
Objetivo principal: ${context.primaryGoal}
Tono de personalidad: ${context.personalityTone}
${context.servicesProducts ? `Servicios/Productos: ${context.servicesProducts}` : ''}
${context.website ? `Website: ${context.website}` : ''}
${context.location ? `Ubicación: ${context.location}` : ''}
`;

    const typeSpecificInstructions = {
      minimalist: 'Crea una bio MINIMALISTA y limpia. Máximo 80 caracteres. Sin emojis excesivos. Directa y profesional.',
      emoji_rich: 'Crea una bio RICA EN EMOJIS (4-6 emojis). Visual y atractiva. Máximo 120 caracteres. Los emojis deben contar una historia.',
      list_format: 'Crea una bio en FORMATO DE LISTA con viñetas o emojis. 3 puntos clave organizados. Máximo 130 caracteres.',
      storytelling: 'Crea una bio con NARRATIVA PERSONAL. Cuenta una micro-historia que conecte emocionalmente. Máximo 140 caracteres.',
      cta_focused: 'Crea una bio ENFOCADA EN CONVERSIÓN. CTA fuerte y claro. Máximo 120 caracteres. Dirigida a generar acción específica.'
    };

    return `
${baseContext}

INSTRUCCIONES ESPECÍFICAS:
${typeSpecificInstructions[bioType]}

REQUISITOS CRÍTICOS:
- MÁXIMO 150 caracteres TOTAL (límite estricto de Instagram)
- ${context.languagePreference === 'english' ? 'Responde en inglés' : 'Responde en español'}
- Incluye 1-2 keywords relevantes del nicho
- ${context.primaryGoal === 'sales' ? 'Incluye CTA para ventas' : 'Incluye CTA apropiado para el objetivo'}
- Mantén el tono ${context.personalityTone}
- Hazla única y memorable
- CUENTA CADA CARÁCTER - No te excedas del límite

Responde SOLO con el texto de la bio, sin explicaciones, comillas o texto adicional.
`;
  }

  /**
   * Create a fallback bio when OpenAI generation fails
   */
  private createFallbackBio(context: BioContext, bioType: GeneratedBio['bioType']): GeneratedBio | null {
    const fallbackTemplates = {
      minimalist: `${context.niche} | ${context.targetAudience}`,
      emoji_rich: `🎯 ${context.niche} 💫 ${context.targetAudience} ✨ ${context.primaryGoal}`,
      list_format: `✓ ${context.niche}\n✓ ${context.targetAudience}\n✓ ${context.primaryGoal}`,
      storytelling: `Ayudo a ${context.targetAudience} con ${context.niche}. Mi misión: ${context.primaryGoal}.`,
      cta_focused: `${context.niche} para ${context.targetAudience}. ¡Sígueme para más!`
    };

    const baseText = fallbackTemplates[bioType];
    if (baseText.length > 150) {
      return null; // Skip if even fallback is too long
    }

    return {
      id: `fallback_${bioType}_${Date.now()}`,
      bioText: baseText,
      bioType,
      characterCount: baseText.length,
      emojiCount: (baseText.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length,
      hasCallToAction: this.detectCallToAction(baseText),
      keywords: this.extractKeywords(baseText, context.niche),
      reasoning: `Bio de respaldo generada automáticamente para asegurar variedad de opciones.`
    };
  }

  /**
   * Process and analyze generated bio response
   */
  private processBioResponse(content: string, bioType: GeneratedBio['bioType'], context: BioContext): GeneratedBio | null {
    try {
      // Clean the bio text
      let bioText = content.trim().replace(/^"|"$/g, '');
      
      // If bio is too long, truncate it intelligently
      if (bioText.length > 150) {
        console.warn(`Bio too long (${bioText.length} chars), truncating to 150...`);
        // Try to truncate at a word boundary near 150 characters
        let truncated = bioText.substring(0, 147);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 100) { // Only use word boundary if it's not too short
          truncated = truncated.substring(0, lastSpace);
        }
        bioText = truncated + '...';
      }

      // Ensure we have actual content
      if (bioText.length < 10) {
        console.warn(`Bio too short (${bioText.length} chars), skipping...`);
        return null;
      }

      // Analyze bio characteristics
      const characterCount = bioText.length;
      const emojiCount = (bioText.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
      const hasCallToAction = this.detectCallToAction(bioText);
      const keywords = this.extractKeywords(bioText, context.niche);
      const reasoning = this.generateReasoning(bioText, bioType, context);

      return {
        id: `bio_${bioType}_${Date.now()}`,
        bioText,
        bioType,
        characterCount,
        emojiCount,
        hasCallToAction,
        keywords,
        reasoning
      };

    } catch (error) {
      console.error('Error processing bio response:', error);
      return null;
    }
  }

  /**
   * Detect if bio has a call to action
   */
  private detectCallToAction(text: string): boolean {
    const ctaPatterns = [
      /👇/g, /⬇️/g, /↓/g,
      /link/i, /aquí/i, /here/i,
      /dm/i, /mensaje/i, /contacto/i,
      /sigue/i, /follow/i,
      /descarga/i, /download/i,
      /únete/i, /join/i
    ];
    
    return ctaPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Extract relevant keywords from bio
   */
  private extractKeywords(text: string, niche: string): string[] {
    const keywords: string[] = [];
    const lowercaseText = text.toLowerCase();
    const nicheWords = niche.toLowerCase().split(' ');
    
    // Add niche-related words found in bio
    nicheWords.forEach(word => {
      if (lowercaseText.includes(word) && word.length > 2) {
        keywords.push(word);
      }
    });
    
    // Common Instagram keywords
    const commonKeywords = [
      'coach', 'entrepreneur', 'creator', 'influencer',
      'fitness', 'food', 'travel', 'fashion', 'lifestyle',
      'business', 'marketing', 'design', 'photography'
    ];
    
    commonKeywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return [...new Set(keywords)]; // Remove duplicates
  }



  /**
   * Generate reasoning for bio quality
   */
  private generateReasoning(bioText: string, bioType: GeneratedBio['bioType'], context: BioContext): string {
    const reasons: string[] = [];
    
    if (bioText.length <= 120) {
      reasons.push('Longitud óptima para lectura rápida');
    }
    
    if (this.detectCallToAction(bioText)) {
      reasons.push('Incluye llamada a la acción efectiva');
    }
    
    const keywords = this.extractKeywords(bioText, context.niche);
    if (keywords.length >= 2) {
      reasons.push(`Optimizada con keywords de ${context.niche}`);
    }
    
    const typeReasons = {
      minimalist: 'Diseño limpio y profesional',
      emoji_rich: 'Visualmente atractiva y expresiva',
      list_format: 'Información organizada y fácil de escanear',
      storytelling: 'Conecta emocionalmente con la audiencia',
      cta_focused: 'Optimizada para generar conversiones'
    };
    
    reasons.push(typeReasons[bioType]);
    
    return reasons.join('. ') + '.';
  }
} 