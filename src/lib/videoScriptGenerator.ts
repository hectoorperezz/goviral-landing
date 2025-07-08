// GoViral Video Script Generator - AI-Powered Content Creation
// Following successful patterns from bio generator

import OpenAI from 'openai';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export interface VideoScriptContext {
  topic: string;
  description: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'general';
  duration: '15s' | '30s' | '60s';
  contentType: 'educativo' | 'entretenimiento' | 'viral' | 'promocional' | 'storytelling';
  targetAudience: string;
  niche: string;
  goal: 'engagement' | 'ventas' | 'awareness' | 'educacion' | 'viral';
  tone: 'profesional' | 'casual' | 'divertido' | 'inspiracional' | 'provocativo';
}

export interface GeneratedScript {
  id: string;
  title: string;
  scriptType: 'gancho_fuerte' | 'storytelling' | 'educativo_rapido' | 'trending_viral' | 'cta_directo';
  hook: string;
  development: string;
  cta: string;
  visualCues: string[];
  audioNotes: string[];
  hashtags: string[];
  reasoning: string;
}

export interface VideoScriptGenerationResult {
  generatedScripts: GeneratedScript[];
  contextAnalysis: {
    nicheInsights: string;
    audienceRecommendations: string;
    platformTips: string;
    trendingOpportunities: string[];
  };
  bestPractices: {
    hookStrategy: string;
    contentStructure: string;
    visualTips: string;
    hashtagStrategy: string;
  };
  generatedAt: string;
}

// ===============================================
// VIDEO SCRIPT GENERATOR SERVICE
// ===============================================

export class VideoScriptGeneratorService {
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
   * Main entry point: Generate multiple script variations
   */
  async generateVideoScripts(context: VideoScriptContext): Promise<VideoScriptGenerationResult | null> {
    try {
      console.log(`🎬 Starting script generation for ${context.topic} on ${context.platform}`);
      
      // Step 1: Generate multiple script variations with OpenAI
      const generatedScripts = await this.generateScriptVariations(context);
      
      if (!generatedScripts || generatedScripts.length === 0) {
        throw new Error('Failed to generate scripts with AI');
      }

      // Step 2: Analyze context and provide insights
      const contextAnalysis = await this.analyzeContextInsights(context);
      
      // Step 3: Generate best practices recommendations
      const bestPractices = this.generateBestPractices(context);
      
      // Step 4: Return comprehensive result
      const result: VideoScriptGenerationResult = {
        generatedScripts,
        contextAnalysis,
        bestPractices,
        generatedAt: new Date().toISOString()
      };
      
      console.log('✅ Script generation complete');
      return result;

    } catch (error) {
      console.error('❌ Error in script generation:', error);
      return null;
    }
  }

  /**
   * Generate multiple script variations using OpenAI
   */
  async generateScriptVariations(context: VideoScriptContext): Promise<GeneratedScript[]> {
    console.log('🤖 Generating script variations with OpenAI...');
    
    const scripts: GeneratedScript[] = [];
    const scriptTypes: GeneratedScript['scriptType'][] = [
      'gancho_fuerte',
      'storytelling', 
      'educativo_rapido',
      'trending_viral',
      'cta_directo'
    ];

    for (const scriptType of scriptTypes) {
      try {
        const prompt = this.buildScriptPrompt(context, scriptType);
        
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en creación de contenido viral para redes sociales. Especializas en crear guiones que maximizan engagement, shares y conversiones en el mercado hispanohablante.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 600
        });

        const content = response.choices[0]?.message?.content;
        if (!content) continue;

        const generatedScript = this.processScriptResponse(content, scriptType, context);
        if (generatedScript) {
          scripts.push(generatedScript);
        }

        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error generating ${scriptType} script:`, error);
        continue;
      }
    }
    
    console.log(`📝 Generated ${scripts.length} script variations`);
    
    // Ensure we always have at least 3 scripts by creating fallbacks if needed
    if (scripts.length < 3) {
      console.log('🔧 Generating fallback scripts to ensure minimum variety...');
      const missingTypes = scriptTypes.filter(type => !scripts.some(script => script.scriptType === type));
      
      for (const scriptType of missingTypes.slice(0, 3 - scripts.length)) {
        const fallbackScript = this.createFallbackScript(context, scriptType);
        if (fallbackScript) {
          scripts.push(fallbackScript);
        }
      }
    }
    
    return scripts;
  }

  /**
   * Analyze context and provide strategic insights
   */
  private async analyzeContextInsights(context: VideoScriptContext): Promise<VideoScriptGenerationResult['contextAnalysis']> {
    console.log('📊 Analyzing context for strategic insights...');
    
    const nicheInsights = this.generateNicheInsights(context);
    const audienceRecommendations = this.generateAudienceRecommendations(context);
    const platformTips = this.generatePlatformTips(context);
    const trendingOpportunities = this.generateTrendingOpportunities(context);

    return {
      nicheInsights,
      audienceRecommendations,
      platformTips,
      trendingOpportunities
    };
  }

  /**
   * Generate niche-specific insights
   */
  private generateNicheInsights(context: VideoScriptContext): string {
    const nicheStrategies: Record<string, string> = {
      fitness: 'En fitness, combina transformaciones visuales con tips prácticos. Los ejercicios de 30 segundos tienen alta viralidad.',
      comida: 'Para contenido gastronómico, enfócate en recetas rápidas y trucos sorprendentes. Las "comidas en 60 segundos" dominan.',
      tecnología: 'En tech, simplifica conceptos complejos. Los "tips de productividad" y "apps secretas" generan mucho engagement.',
      moda: 'En moda, muestra transformaciones y outfits versátiles. Los "outfit challenges" son muy virales.',
      finanzas: 'Para finanzas personales, usa ejemplos prácticos y cifras impactantes. Los "tips para ahorrar" siempre funcionan.',
      educación: 'En educación, crea contenido "bite-sized" y visual. Los "datos curiosos" y "mitos vs realidad" captan atención.',
      belleza: 'En belleza, los tutoriales rápidos y "before/after" dominan. Las rutinas de skincare de 1 minuto son oro.',
      viajes: 'Para viajes, enfócate en lugares únicos y tips locales. Los "destinos secretos" generan mucho interés.',
      negocios: 'En negocios, comparte casos de éxito y errores comunes. Los "consejos de millonarios" siempre atraen.',
      default: 'Identifica el problema principal de tu audiencia y ofrece soluciones rápidas y accionables.'
    };
    
    const normalizedNiche = context.niche.toLowerCase();
    return nicheStrategies[normalizedNiche] || nicheStrategies.default;
  }

  /**
   * Generate audience-specific recommendations
   */
  private generateAudienceRecommendations(context: VideoScriptContext): string {
    const ageInsights: Record<string, string> = {
      'gen-z': 'GenZ valora autenticidad y humor. Usa referencias pop y trends actuales.',
      'millennials': 'Millennials buscan value y nostalgia. Combina practicidad con referencias de los 2000s.',
      'gen-x': 'GenX prefiere contenido directo y profesional. Enfócate en eficiencia y resultados.',
      'boomers': 'Boomers valoran claridad y detalle. Explica paso a paso sin prisa.',
      'default': 'Adapta el lenguaje a tu audiencia específica y usa ejemplos relevantes para su contexto.'
    };
    
    // Simple audience detection based on common patterns
    const audience = context.targetAudience.toLowerCase();
    if (audience.includes('joven') || audience.includes('15-25')) return ageInsights['gen-z'];
    if (audience.includes('millennial') || audience.includes('25-40')) return ageInsights['millennials'];
    if (audience.includes('adulto') || audience.includes('40-55')) return ageInsights['gen-x'];
    if (audience.includes('mayor') || audience.includes('55+')) return ageInsights['boomers'];
    
    return ageInsights['default'];
  }

  /**
   * Generate platform-specific tips
   */
  private generatePlatformTips(context: VideoScriptContext): string {
    const platformStrategies: Record<string, string> = {
      instagram: 'Instagram Reels: Hook en los primeros 3 segundos, mantén ritmo dinámico, usa trending audio y hashtags relevantes.',
      tiktok: 'TikTok: Sigue trends actuales, usa efectos populares, crea contenido auténtico y participa en challenges.',
      youtube: 'YouTube Shorts: Optimiza thumbnail y título, cuenta una historia completa, incluye llamadas a suscripción.',
      general: 'Para múltiples plataformas: Crea contenido vertical, mantén atención constante, optimiza para ver sin sonido.'
    };
    
    return platformStrategies[context.platform] || platformStrategies['general'];
  }

  /**
   * Generate trending opportunities
   */
  private generateTrendingOpportunities(context: VideoScriptContext): string[] {
    const trendingFormats = [
      'Tutorial paso a paso',
      'Antes vs Después',
      'Mitos vs Realidad',
      'Errores comunes',
      '5 tips en 60 segundos',
      'Reacción/Review',
      'Day in my life',
      'Transformación',
      'Comparación de productos',
      'Consejos de experto'
    ];
    
    // Return 4-5 relevant trending opportunities
    return trendingFormats.slice(0, 5);
  }

  /**
   * Generate best practices recommendations
   */
  private generateBestPractices(context: VideoScriptContext): VideoScriptGenerationResult['bestPractices'] {
    return {
      hookStrategy: this.getHookStrategy(context),
      contentStructure: this.getContentStructure(context),
      visualTips: this.getVisualTips(context),
      hashtagStrategy: this.getHashtagStrategy(context)
    };
  }

  private getHookStrategy(context: VideoScriptContext): string {
    const hookStrategies: Record<string, string> = {
      '15s': 'Hook inmediato: Primera palabra debe ser impactante. Máximo 2 segundos para captar atención.',
      '30s': 'Hook + preview: Muestra el resultado final en los primeros 3 segundos, luego desarrolla.',
      '60s': 'Hook + teaser: 5 segundos para hook, después promete 3-5 tips valiosos.',
      '3min+': 'Hook narrativo: 10 segundos para establecer problema y prometer solución completa.'
    };
    
    return hookStrategies[context.duration] || hookStrategies['30s'];
  }

  private getContentStructure(context: VideoScriptContext): string {
    const structures: Record<string, string> = {
      educativo: 'Problema → Solución → Demostración → Resultado',
      entretenimiento: 'Hook → Desarrollo divertido → Climax → Resolución',
      viral: 'Impacto visual → Explicación rápida → Twist → CTA para compartir',
      promocional: 'Problema → Producto/Servicio → Beneficios → Llamada a acción',
      storytelling: 'Contexto → Conflicto → Desarrollo → Resolución inspiradora'
    };
    
    return structures[context.contentType] || structures['educativo'];
  }

  private getVisualTips(context: VideoScriptContext): string {
    const visualTips: Record<string, string> = {
      instagram: `Elementos visuales clave: Ratio 9:16, primeros 3 segundos críticos con hook visual fuerte. Combina hablar a cámara (credibilidad) + B-roll (engagement) + text overlays (comprensión). Usa colores vibrantes, texto grande (mín. 24pt), transiciones rápidas cada 2-3 segundos. Incluye elementos trending actuales.`,
      tiktok: `Formato nativo vertical: Jump cuts dinámicos, efectos trending del momento, buena iluminación (natural preferible), movimiento constante. Combina talking head + demostraciones + text overlays creativos. Audio sincronizado crucial. Hooks visuales en primeros 2 segundos.`,
      youtube: `Shorts verticales: Thumbnail atractivo si aplica, captions automáticos siempre, zoom para énfasis en puntos clave, logo/branding sutil pero presente. Estructura: Hook visual → Contenido → CTA visual. Calidad de imagen alta, audio perfecto.`,
      general: `Fundamentos universales: Video vertical (9:16), combina hablar a cámara con B-roll relevante, text overlays para puntos clave, buena calidad de audio (crítico), elementos visuales claros y legibles, branding consistente pero no invasivo. Ritmo dinámico adaptado a duración.`
    };
    
    return visualTips[context.platform] || visualTips['general'];
  }

  private getHashtagStrategy(context: VideoScriptContext): string {
    return `Combina hashtags populares (100K-1M posts) con nicho específicos (10K-100K posts). Para ${context.platform}: 5-10 hashtags relevantes, incluye 2-3 trending del día.`;
  }



  /**
   * Build prompt for specific script type
   */
  private buildScriptPrompt(context: VideoScriptContext, scriptType: GeneratedScript['scriptType']): string {
    const basePrompt = `
CONTEXTO DEL VIDEO:
- Tema: ${context.topic}
- Descripción detallada: ${context.description}
- Plataforma: ${context.platform}
- Duración: ${context.duration}
- Tipo de contenido: ${context.contentType}
- Audiencia: ${context.targetAudience}
- Nicho: ${context.niche}
- Objetivo: ${context.goal}
- Tono: ${context.tone}

TIPO DE SCRIPT: ${scriptType}
`;

    const scriptTypePrompts: Record<string, string> = {
      gancho_fuerte: `
${basePrompt}

Basándote ESPECÍFICAMENTE en la descripción detallada del usuario, crea un guión con HOOK ULTRA IMPACTANTE que capture atención en los primeros 2 segundos.

IMPORTANTE: Usa EXACTAMENTE la información que proporciona el usuario en su descripción detallada. No inventes información adicional.

ESTRUCTURA REQUERIDA:
1. HOOK (impactante, controversial o sorprendente - basado en su descripción)
2. DESARROLLO (mantiene tensión, revela valor específico que menciona)
3. CTA (clara y específica al objetivo del usuario)

También incluye:
- TÍTULO atractivo para el post (relacionado directamente con su descripción)
- 4-5 PISTAS VISUALES ESPECÍFICAS Y DETALLADAS (ejemplo: "Primer plano hablando a cámara con expresión sorprendida", "Texto overlay con estadística impactante", "B-roll de producto/situación específica", "Gráfico o imagen que ilustre el punto clave")
- 2-3 NOTAS DE AUDIO/MÚSICA (apropiadas para su contenido)
- 8-10 HASHTAGS estratégicos (relacionados con su nicho y tema específico)
- REASONING: Por qué este hook funcionará para SU contenido específico

Las visualCues deben ser MUY ESPECÍFICAS indicando:
- Si hablas a cámara o off-camera
- Qué tipo de imágenes/B-roll mostrar
- Overlays de texto específicos
- Ángulos de cámara sugeridos
- Props o elementos visuales necesarios

Responde SOLO en este formato JSON:
{
  "title": "título here",
  "hook": "hook here", 
  "development": "development here",
  "cta": "cta here",
  "visualCues": ["visual específico 1", "visual específico 2", "visual específico 3", "visual específico 4"],
  "audioNotes": ["audio1", "audio2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "reasoning": "reasoning here"
}`,

      storytelling: `
${basePrompt}

Basándote en la descripción detallada del usuario, crea un guión con NARRATIVA PERSONAL que conecte emocionalmente con la audiencia.

IMPORTANTE: Utiliza los elementos específicos que menciona en su descripción para crear una historia auténtica y relatable.

ESTRUCTURA REQUERIDA:
1. HOOK (situación personal/relatable basada en su experiencia)
2. DESARROLLO (historia que incluye los puntos específicos que menciona)
3. CTA (invita a compartir experiencias relacionadas con su tema)

También incluye:
- TÍTULO personal y auténtico (que refleje su descripción)
- 4-5 PISTAS VISUALES DETALLADAS para storytelling (ejemplo: "Hablar a cámara en entorno íntimo/personal", "Flashback visual de la situación/antes", "Close-up de reacción emocional", "Imágenes que ilustren el cambio/resultado", "Texto overlay con quote emotional key")
- 2-3 NOTAS DE AUDIO emocionales apropiadas
- 8-10 HASHTAGS de comunidad y nicho específico
- REASONING: Por qué esta historia resonará con su audiencia específica

Las visualCues para storytelling deben incluir:
- Momentos de hablar directamente a cámara para intimidad
- B-roll que ilustre la historia (antes/después, proceso, momentos clave)
- Elementos emotivos (close-ups, reacciones, ambiente)
- Overlays de texto con frases importantes de la historia
- Transiciones visuales que apoyen la narrativa

Responde SOLO en este formato JSON:
{
  "title": "título here",
  "hook": "hook here",
  "development": "development here", 
  "cta": "cta here",
  "visualCues": ["visual storytelling 1", "visual storytelling 2", "visual storytelling 3", "visual storytelling 4"],
  "audioNotes": ["audio1", "audio2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "reasoning": "reasoning here"
}`,

      educativo_rapido: `
${basePrompt}

Usando la descripción detallada del usuario, crea un guión EDUCATIVO que entregue valor inmediato y accionable.

IMPORTANTE: Estructura el contenido educativo exactamente como lo describe el usuario. Si menciona pasos específicos, úsalos. Si habla de errores comunes, inclúyelos.

ESTRUCTURA REQUERIDA:
1. HOOK (promesa específica basada en lo que va a enseñar)
2. DESARROLLO (tips/pasos exactos que menciona en su descripción)
3. CTA (invita a implementar sus consejos específicos/seguir para más)

También incluye:
- TÍTULO que prometa el valor específico que describe
- 4-5 PISTAS VISUALES EDUCATIVAS ESPECÍFICAS (ejemplo: "Hablar a cámara explicando concepto inicial", "Screen recording demostrando paso 1", "Overlay de texto con tip número X", "Before/after visual de resultado", "Infográfico o gráfico explicativo del concepto")
- 2-3 NOTAS DE AUDIO profesionales apropiadas
- 8-10 HASHTAGS educativos y de su nicho específico
- REASONING: Por qué este contenido educativo específico es valioso

Las visualCues educativas deben incluir:
- Explicaciones directas a cámara para establecer credibilidad
- Demostraciones prácticas (screen recordings, hands-on, ejemplos)
- Overlays de texto con pasos numerados o tips clave
- Elementos gráficos que simplifiquen conceptos complejos
- Before/after o comparaciones visuales
- Props, herramientas o materiales específicos que se mencionan

Responde SOLO en este formato JSON:
{
  "title": "título here",
  "hook": "hook here",
  "development": "development here",
  "cta": "cta here", 
  "visualCues": ["visual educativo 1", "visual educativo 2", "visual educativo 3", "visual educativo 4"],
  "audioNotes": ["audio1", "audio2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "reasoning": "reasoning here"
}`,

      trending_viral: `
${basePrompt}

Toma la descripción específica del usuario y crea un guión que incorpore ELEMENTOS VIRALES y trending actuales.

IMPORTANTE: Mantén el contenido específico que describe pero preséntalo de forma viral y trending.

ESTRUCTURA REQUERIDA:
1. HOOK (presenta su contenido con formato trend/challenge actual)
2. DESARROLLO (su contenido específico con twist viral único)
3. CTA (invita a participar/compartir relacionado con su tema)

También incluye:
- TÍTULO viral y shareable basado en su descripción
- 4-5 PISTAS VISUALES VIRALES ESPECÍFICAS (ejemplo: "Jump cut dinámico hablando a cámara con energia", "Trending transition o efecto popular", "Text overlay con frase controversial/impactante", "B-roll con timing perfecto para trend", "Llamada a la acción visual con gesture o movimiento trending")
- 2-3 NOTAS DE AUDIO populares/trending apropiadas
- 8-10 HASHTAGS virales y de su nicho específico
- REASONING: Por qué SU contenido específico tiene potencial viral

Las visualCues virales deben incluir:
- Elementos trending actuales (transiciones, efectos, gestos populares)
- Timing dinámico y jump cuts para mantener atención
- Text overlays con frases pegajosas o controversial
- Calls-to-action visuales que inviten a participar
- Elementos shareable y memeable
- Uso de trends visuales populares adaptados al contenido específico

Responde SOLO en este formato JSON:
{
  "title": "título here",
  "hook": "hook here",
  "development": "development here",
  "cta": "cta here",
  "visualCues": ["visual viral 1", "visual viral 2", "visual viral 3", "visual viral 4"], 
  "audioNotes": ["audio1", "audio2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "reasoning": "reasoning here"
}`,

      cta_directo: `
${basePrompt}

Basándote en la descripción específica del usuario, crea un guión optimizado para CONVERSIÓN con CTA súper específico.

IMPORTANTE: Usa el contenido específico que describe para crear urgencia y necesidad real en su audiencia objetivo.

ESTRUCTURA REQUERIDA:
1. HOOK (problema/necesidad urgente basada en lo que resuelve)
2. DESARROLLO (solución específica que ofrece con beneficios claros)
3. CTA (acción específica y urgente relacionada con su objetivo)

También incluye:
- TÍTULO orientado a conversión basado en su propuesta
- 4-5 PISTAS VISUALES PERSUASIVAS ESPECÍFICAS (ejemplo: "Hablar a cámara con confianza estableciendo problema", "Demostración visual del producto/servicio/resultado", "Testimonial visual o caso de éxito", "Call-to-action visual claro con texto overlay", "Elemento de urgencia visual (tiempo limitado, cantidad limitada)")
- 2-3 NOTAS DE AUDIO que generen urgencia apropiada
- 8-10 HASHTAGS de conversión y nicho específico
- REASONING: Por qué SU contenido específico generará conversiones

Las visualCues de conversión deben incluir:
- Establecimiento de credibilidad hablando a cámara
- Demostración clara del producto/servicio/resultado prometido
- Elementos de proof social (testimonials, resultados, casos de éxito)
- CTAs visuales claros y específicos con overlays de texto
- Elementos de urgencia y escasez visuales
- Before/after comparisons o resultados tangibles
- Información de contacto o próximos pasos claramente visibles

Responde SOLO en este formato JSON:
{
  "title": "título here",
  "hook": "hook here",
  "development": "development here",
  "cta": "cta here",
  "visualCues": ["visual conversión 1", "visual conversión 2", "visual conversión 3", "visual conversión 4"],
  "audioNotes": ["audio1", "audio2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "reasoning": "reasoning here"
}`,
    };

    return scriptTypePrompts[scriptType] || scriptTypePrompts['gancho_fuerte'];
  }

  /**
   * Process OpenAI response and create GeneratedScript object
   */
  private processScriptResponse(content: string, scriptType: GeneratedScript['scriptType'], context: VideoScriptContext): GeneratedScript | null {
    try {
      // Try to parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in OpenAI response');
        return null;
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      if (!parsedResponse.title || !parsedResponse.hook || !parsedResponse.development || !parsedResponse.cta) {
        console.error('Missing required fields in OpenAI response');
        return null;
      }

      return {
        id: `${scriptType}_${Date.now()}`,
        title: parsedResponse.title,
        scriptType,
        hook: parsedResponse.hook,
        development: parsedResponse.development,
        cta: parsedResponse.cta,
        visualCues: parsedResponse.visualCues || [],
        audioNotes: parsedResponse.audioNotes || [],
        hashtags: parsedResponse.hashtags || [],
        reasoning: parsedResponse.reasoning || `Script optimizado para ${scriptType} en ${context.platform}`
      };

    } catch (error) {
      console.error('Error parsing script response:', error);
      return null;
    }
  }



  /**
   * Create fallback script if OpenAI fails
   */
  private createFallbackScript(context: VideoScriptContext, scriptType: GeneratedScript['scriptType']): GeneratedScript | null {
    const fallbackTemplates = {
      gancho_fuerte: {
        title: `${context.topic}: El secreto que nadie te dice`,
        hook: `¿Sabías que ${context.topic} puede cambiar tu vida en 30 días?`,
        development: `Te explico la estrategia exacta que uso para dominar ${context.topic}. Paso 1: [acción específica]. Paso 2: [implementación]. Paso 3: [resultados].`,
        cta: `¿Ya probaste esto? Comenta tu experiencia 👇`,
        visualCues: [
          `Hablar a cámara con expresión intrigante para hacer la pregunta hook`,
          `Text overlay: "30 DÍAS = CAMBIO TOTAL" sobre fondo llamativo`,
          `Demostración paso a paso con overlays numerados (1, 2, 3)`,
          `Close-up del resultado final o antes/después del cambio`
        ]
      },
      storytelling: {
        title: `Mi experiencia real con ${context.topic}`,
        hook: `Hace un año no sabía nada sobre ${context.topic}...`,
        development: `Al principio cometí todos los errores típicos. Pero después de mucha práctica, descubrí lo que realmente funciona. Ahora te comparto mis mejores consejos.`,
        cta: `¿Tú también pasaste por esto? Comparte tu historia 💭`,
        visualCues: [
          `Hablar a cámara en ambiente íntimo, estableciendo conexión personal`,
          `Flashback visual o foto de "hace un año" con efecto vintage`,
          `Montage de errores comunes con X rojas o efectos de "fail"`,
          `Momento de revelación con transición visual impactante`,
          `Text overlay: "COMPARTE TU HISTORIA" con call-to-action visual`
        ]
      },
      educativo_rapido: {
        title: `3 tips de ${context.topic} que funcionan siempre`,
        hook: `Estos 3 tips de ${context.topic} me cambiaron todo:`,
        development: `1. [Tip específico con explicación]. 2. [Segundo tip práctico]. 3. [Tip avanzado]. Implementa estos hoy mismo.`,
        cta: `¿Cuál vas a probar primero? Déjamelo en comentarios ⬇️`,
        visualCues: [
          `Hablar a cámara estableciendo credibilidad sobre el tema`,
          `Text overlay numerado: "TIP #1" con animación de aparición`,
          `Demostración práctica del tip 1 con hands-on o screen recording`,
          `Repetir formato para tip #2 y #3 con consistencia visual`,
          `Text overlay final: "¿CUÁL PRUEBAS PRIMERO?" con emoji de pregunta`
        ]
      },
      trending_viral: {
        title: `${context.topic} pero hazlo viral`,
        hook: `Todos hacen ${context.topic} mal... hasta ahora`,
        development: `La forma correcta es totalmente diferente. Te muestro el método que está revolucionando ${context.niche}. Es súper fácil y funciona siempre.`,
        cta: `Tag a alguien que necesita ver esto 🔥`,
        visualCues: [
          `Jump cut dinámico con expresión de sorpresa o revelation`,
          `Split screen: "FORMA INCORRECTA" vs "FORMA CORRECTA"`,
          `Trending transition effect popular en la plataforma`,
          `Text overlay viral: "ESTO LO CAMBIA TODO" con efectos llamativos`,
          `Call-to-action visual con gesture de tagging y emoji de fuego`
        ]
      },
      cta_directo: {
        title: `Domina ${context.topic} en tiempo récord`,
        hook: `Si quieres resultados reales en ${context.topic}, esto es para ti`,
        development: `He ayudado a cientos de personas a conseguir resultados increíbles. El secreto está en [estrategia específica]. No pierdas más tiempo con métodos que no funcionan.`,
        cta: `¿Listo para empezar? Envíame DM con "EMPEZAR" 📩`,
        visualCues: [
          `Hablar a cámara con confianza estableciendo el problema/necesidad`,
          `Testimoniales visuales o capturas de pantalla de resultados`,
          `Demostración del método/estrategia con elementos gráficos`,
          `Text overlay de urgencia: "NO PIERDAS MÁS TIEMPO"`,
          `CTA visual claro: "DM: EMPEZAR" con animación de mensaje`
        ]
      }
    };

    const template = fallbackTemplates[scriptType];
    if (!template) return null;

    return {
      id: `fallback_${scriptType}_${Date.now()}`,
      title: template.title,
      scriptType,
      hook: template.hook,
      development: template.development,
      cta: template.cta,
      visualCues: template.visualCues,
      audioNotes: ['Música de fondo trending apropiada para el tono', 'Narración clara y enérgica que mantenga engagement'],
      hashtags: [`#${context.niche}`, `#${context.topic}`, '#viral', '#tips', '#contenido', '#reels', '#fyp', '#parati'],
      reasoning: `Script de respaldo optimizado para ${scriptType} que combina mejores prácticas probadas con visuales específicos para ${context.platform}.`
    };
  }
}

// Export main function for backwards compatibility
export async function generateVideoScripts(context: VideoScriptContext): Promise<VideoScriptGenerationResult | null> {
  const service = new VideoScriptGeneratorService();
  return service.generateVideoScripts(context);
} 