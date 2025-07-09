import OpenAI from 'openai';
import { supabase } from './supabase';
import { generateBlogImage } from './imageGeneration';

// Lazy initialization of OpenAI client to avoid build-time errors
let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
};

// Interfaces para el sistema
type PromotionIntensity = 'informativo' | 'moderado' | 'promocional';

interface KeywordResearch {
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchVolume: string;
  difficulty: string;
  intent: string;
}

interface ArticleOutline {
  title: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  sections: {
    heading: string;
    subheadings: string[];
    keyPoints: string[];
  }[];
}

interface GeneratedArticle {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  featuredImage?: string;
}

/**
 * MOTOR DE INVESTIGACIÓN DE KEYWORDS
 * Genera keywords relevantes para SMM en español
 */
export class KeywordResearchEngine {
  async generateKeywords(topic: string, promotionIntensity: PromotionIntensity = 'moderado', customPrompt?: string): Promise<KeywordResearch> {
    const getPromotionGuidelines = (intensity: PromotionIntensity) => {
      switch (intensity) {
        case 'informativo':
          return `
ENFOQUE INFORMATIVO:
- Enfócate en educación y divulgación sobre redes sociales
- No es necesario mencionar GoViral explícitamente
- Keywords orientadas a información general y tips
- Contenido de valor sin presión comercial`;
        
        case 'moderado':
          return `
ENFOQUE MODERADO:
- Combina información valiosa con menciones sutiles de herramientas
- Menciona GoViral de forma natural cuando sea relevante
- Keywords balanceadas entre información y servicios
- Enfoque en soluciones sin ser muy directo`;
        
        case 'promocional':
          return `
ENFOQUE PROMOCIONAL:
- Orienta claramente hacia servicios de GoViral
- Keywords comerciales y de conversión
- Menciones directas de herramientas automatizadas
- CTAs claros hacia servicios de la empresa`;
        
        default:
          return '';
      }
    };

    const prompt = `
Actúa como un experto en SEO y marketing de redes sociales en español, trabajando para GoViral, una empresa líder en herramientas automatizadas de social media marketing.

CONTEXTO EMPRESARIAL:
GoViral es una empresa de social media marketing que ofrece:
- Herramientas automatizadas para incrementar seguidores, likes y comentarios
- Servicios de creación de contenido y gestión de redes sociales
- Soluciones de tráfico inorgánico e interacciones automatizadas
- Herramientas de análisis y optimización de contenido

${getPromotionGuidelines(promotionIntensity)}

Para el tema: "${topic}"

${customPrompt ? `DIRECTRICES ADICIONALES DEL USUARIO:
${customPrompt}

` : ''}Genera una investigación de keywords enfocada en:
- Mercado hispano (España y Latinoamérica)
- Ajusta el enfoque según la intensidad promocional indicada
- Tráfico inorgánico, interacciones automatizadas (cuando sea relevante)
- Intent comercial e informacional según la intensidad
- Keywords que posicionen positivamente las herramientas automatizadas
- Términos que eviten connotaciones negativas sobre bots/automatización

IMPORTANTE: Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin explicaciones, sin comillas de código.

Formato JSON requerido:
{
  "primaryKeyword": "keyword principal optimizado",
  "secondaryKeywords": ["keyword2", "keyword3", "keyword4", "keyword5"],
  "searchVolume": "estimación de búsquedas mensuales",
  "difficulty": "baja/media/alta",
  "intent": "informacional/comercial/transaccional"
}
`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;
    
    // Limpiar el resultado para extraer solo el JSON
    let cleanedResult = result!;
    
    // Buscar el primer { y el último }
    const firstBrace = cleanedResult.indexOf('{');
    const lastBrace = cleanedResult.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedResult = cleanedResult.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(cleanedResult) as KeywordResearch;
  }
}

/**
 * GENERADOR DE ESTRUCTURA OPTIMIZADA
 * Crea outlines SEO-optimized para máximo ranking
 */
export class OutlineGenerator {
  async generateOutline(keywords: KeywordResearch, promotionIntensity: PromotionIntensity = 'moderado', customPrompt?: string): Promise<ArticleOutline> {
    const getOutlineGuidelines = (intensity: PromotionIntensity) => {
      switch (intensity) {
        case 'informativo':
          return `
ENFOQUE INFORMATIVO:
- Céntrate en educación y tips valiosos sobre redes sociales
- No es necesario mencionar GoViral o sus servicios explícitamente
- Estructura orientada a resolver problemas informativos
- Sin CTAs comerciales directos
- Enfoque en divulgación de conocimiento`;
        
        case 'moderado':
          return `
ENFOQUE MODERADO:
- Combina información valiosa con menciones sutiles de herramientas
- Menciona GoViral de forma natural cuando sea relevante al contenido
- Incluye secciones que naturalmente sugieran soluciones automatizadas
- CTAs suaves hacia herramientas cuando sea apropiado
- Balance entre educación y conversión`;
        
        case 'promocional':
          return `
ENFOQUE PROMOCIONAL:
- Orienta claramente hacia conversión y servicios de GoViral
- Menciones directas de herramientas automatizadas como soluciones
- Incluye secciones específicas sobre beneficios de servicios GoViral
- CTAs claros hacia herramientas de la empresa
- Estructura orientada a generar leads y conversiones`;
        
        default:
          return '';
      }
    };

    const prompt = `
Actúa como un experto en content marketing y SEO para redes sociales, trabajando para GoViral.

CONTEXTO EMPRESARIAL DE GOVIRAL:
- Empresa líder en herramientas automatizadas de social media marketing
- Ofrece servicios de incremento de seguidores, likes y engagement
- Especialista en tráfico inorgánico e interacciones automatizadas
- Posicionamiento: las herramientas automatizadas son legítimas y efectivas
- Terminología preferida: "interacciones automatizadas", "herramientas de crecimiento"
- Evitar: términos negativos sobre bots, menciones de "compra falsa" o prácticas dudosas

${getOutlineGuidelines(promotionIntensity)}

Keywords: ${JSON.stringify(keywords)}

${customPrompt ? `DIRECTRICES ADICIONALES DEL USUARIO:
${customPrompt}

` : ''}Crea un outline ultra-optimizado para un artículo de blog que:
- Rankee para estas keywords en Google
- Ajuste el nivel de promoción según la intensidad indicada
- Sea de 2000-3000 palabras
- Use estructura H1, H2, H3 optimizada para SEO
- Posicione las soluciones automatizadas como profesionales y efectivas (cuando sea relevante)

IMPORTANTE: Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin explicaciones, sin comillas de código.

Formato JSON requerido:
{
  "title": "Título principal optimizado (máximo 190 caracteres)",
  "seoTitle": "Título SEO (MÁXIMO 55 caracteres - MUY IMPORTANTE)",
  "metaDescription": "Meta descripción optimizada (MÁXIMO 155 caracteres)",
  "keywords": ["array", "de", "keywords"],
  "sections": [
    {
      "heading": "H2 principal",
      "subheadings": ["H3 subsección 1", "H3 subsección 2"],
      "keyPoints": ["punto clave 1", "punto clave 2", "punto clave 3"]
    }
  ]
}
`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const result = response.choices[0].message.content;
    
    // Limpiar el resultado para extraer solo el JSON
    let cleanedResult = result!;
    
    // Buscar el primer { y el último }
    const firstBrace = cleanedResult.indexOf('{');
    const lastBrace = cleanedResult.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedResult = cleanedResult.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(cleanedResult) as ArticleOutline;
  }
}

/**
 * GENERADOR DE CONTENIDO ULTRA-OPTIMIZADO
 * Crea artículos completos listos para publicar
 */
export class UltraContentGenerator {
  async generateFullArticle(outline: ArticleOutline, promotionIntensity: PromotionIntensity = 'moderado', customPrompt?: string): Promise<string> {
    const getContentGuidelines = (intensity: PromotionIntensity) => {
      switch (intensity) {
        case 'informativo':
          return `
ENFOQUE INFORMATIVO - CONVERSIÓN:
- NO menciones GoViral o sus servicios explícitamente
- Enfócate en educar y proporcionar valor
- Sin CTAs comerciales directos
- Contenido puramente informativo y educativo
- Habla de estrategias generales sin promocionar servicios específicos`;
        
        case 'moderado':
          return `
ENFOQUE MODERADO - CONVERSIÓN:
- Menciona herramientas de GoViral de forma natural y sutil cuando sea relevante
- Sugiere servicios de tráfico inorgánico ocasionalmente
- CTAs suaves hacia "herramientas profesionales" sin ser agresivo
- Balance entre educación y conversión sutil
- Posiciona GoViral como opción cuando sea natural al contenido`;
        
        case 'promocional':
          return `
ENFOQUE PROMOCIONAL - CONVERSIÓN:
- Menciona herramientas de GoViral claramente en contexto
- Sugiere servicios de tráfico inorgánico cuando sea relevante
- CTAs directos hacia "acelerar tu crecimiento con herramientas profesionales"
- Posiciona GoViral como LA solución para crecimiento rápido y efectivo
- Incluye llamadas a la acción claras y convincentes`;
        
        default:
          return '';
      }
    };

    const prompt = `
Actúa como un copywriter experto en marketing de redes sociales en español, escribiendo para GoViral.

CONTEXTO EMPRESARIAL DE GOVIRAL:
- Empresa líder en herramientas automatizadas de social media marketing
- Servicios: incremento de seguidores, likes, comentarios, herramientas de contenido
- Especialista en tráfico inorgánico e interacciones automatizadas
- Audiencia: emprendedores, marcas, influencers que buscan crecer en redes sociales
- Terminología positiva: "tráfico inorgánico", "interacciones automatizadas", "herramientas de crecimiento"

${getContentGuidelines(promotionIntensity)}

Outline: ${JSON.stringify(outline)}

${customPrompt ? `DIRECTRICES ADICIONALES DEL USUARIO:
${customPrompt}

` : ''}Escribe un artículo COMPLETO de 2500+ palabras que:

ESTRUCTURA:
- Use markdown para H1, H2, H3
- Párrafos de 2-3 líneas máximo
- Listas bullets frecuentes
- Quotes destacadas con >
- Call-to-actions naturales según intensidad promocional

CONTENIDO:
- Español nativo (España/Latam)
- Tono experto pero accesible
- Ejemplos prácticos y específicos
- Datos y estadísticas reales del sector SMM
- Tips accionables para crecer en redes sociales

POSICIONAMIENTO ESTRATÉGICO:
- Presenta las herramientas automatizadas como soluciones profesionales (cuando sea relevante)
- Habla de tráfico inorgánico como estrategia válida de marketing digital (cuando sea apropiado)
- Evita términos negativos sobre automatización o bots
- Enfatiza resultados reales y medibles

SEO:
- Usa las keywords naturalmente
- Densidad de keyword 1-2%
- Sinónimos y variaciones
- Estructura optimizada para featured snippets

IMPORTANTE: Devuelve SOLO el contenido markdown del artículo, sin explicaciones adicionales.
`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0].message.content || '';
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 190); // Limit slug length for database
  }

  // Helper to ensure field lengths comply with database constraints
  ensureFieldLengths(outline: ArticleOutline): ArticleOutline {
    return {
      ...outline,
      title: outline.title.substring(0, 190), // varchar(200) limit
      seoTitle: outline.seoTitle.substring(0, 55), // varchar(60) limit with margin
      metaDescription: outline.metaDescription.substring(0, 155), // varchar(160) limit with margin
      keywords: outline.keywords.slice(0, 10) // Reasonable limit for keywords array
    };
  }

  generateExcerpt(content: string): string {
    // Extract first paragraph that's not a heading
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && !line.startsWith('>')) {
        return line.trim().substring(0, 200) + '...';
      }
    }
    return 'Descubre estrategias probadas para hacer crecer tu presencia en redes sociales y conseguir más seguidores reales.';
  }
}

/**
 * PUBLICADOR AUTOMÁTICO
 * Sube el artículo directamente a Supabase
 */
export class AutoPublisher {
  async publishArticle(article: GeneratedArticle): Promise<string> {
    try {
      if (!supabase) {
        throw new Error('Supabase client not available. Check environment variables.');
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          featured_image: article.featuredImage,
          seo_title: article.seoTitle,
          meta_description: article.metaDescription,
          keywords: article.keywords,
          category: article.category,
          published_at: new Date().toISOString(),
          view_count: 0
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error publishing article: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      console.error('Error in publishArticle:', error);
      throw error;
    }
  }
}

/**
 * PIPELINE COMPLETO DE AUTOMATIZACIÓN
 * Función principal que ejecuta todo el flujo
 */
export class BlogAutomationPipeline {
  private keywordEngine = new KeywordResearchEngine();
  private outlineGenerator = new OutlineGenerator();
  private contentGenerator = new UltraContentGenerator();
  private publisher = new AutoPublisher();

  async generateAndPublishArticle(
    topic: string, 
    category: string = 'social-media-marketing',
    promotionIntensity: PromotionIntensity = 'moderado',
    customPrompt?: string
  ): Promise<{
    success: boolean;
    articleId?: string;
    article?: GeneratedArticle;
    error?: string;
  }> {
    try {
      console.log(`🔍 Investigando keywords para: ${topic}`);
      const keywords = await this.keywordEngine.generateKeywords(topic, promotionIntensity, customPrompt);
      
      console.log(`📝 Generando outline optimizado...`);
      const rawOutline = await this.outlineGenerator.generateOutline(keywords, promotionIntensity, customPrompt);
      const outline = this.contentGenerator.ensureFieldLengths(rawOutline);
      
      console.log(`✍️ Escribiendo artículo completo...`);
      const content = await this.contentGenerator.generateFullArticle(outline, promotionIntensity, customPrompt);
      
      console.log(`🎨 Generando imagen de portada...`);
      const featuredImage = await generateBlogImage(topic, outline.title, category, 'aesthetic');
      console.log(`📸 Imagen de portada generada: ${featuredImage}`);
      
      const article: GeneratedArticle = {
        title: outline.title,
        slug: this.contentGenerator.generateSlug(outline.title),
        content,
        excerpt: this.contentGenerator.generateExcerpt(content),
        seoTitle: outline.seoTitle,
        metaDescription: outline.metaDescription,
        keywords: outline.keywords,
        category,
        featuredImage
      };

      console.log(`🚀 Publicando artículo: ${article.title}`);
      const articleId = await this.publisher.publishArticle(article);

      console.log(`✅ Artículo publicado exitosamente con ID: ${articleId}`);
      
      return {
        success: true,
        articleId,
        article
      };

    } catch (error) {
      console.error('Error in automation pipeline:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Función para generar múltiples artículos
   */
  async generateBatch(
    topics: string[], 
    category: string = 'social-media-marketing',
    promotionIntensity: PromotionIntensity = 'moderado',
    customPrompt?: string
  ): Promise<Array<{
    topic: string;
    success: boolean;
    articleId?: string;
    error?: string;
  }>> {
    const results = [];
    
    for (const topic of topics) {
      console.log(`\n🎯 Procesando: ${topic}`);
      const result = await this.generateAndPublishArticle(topic, category, promotionIntensity, customPrompt);
      
      results.push({
        topic,
        success: result.success,
        articleId: result.articleId,
        error: result.error
      });

      // Delay between articles to avoid rate limits
      if (topics.indexOf(topic) < topics.length - 1) {
        console.log('⏱️ Esperando 30 segundos antes del siguiente artículo...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    return results;
  }
}

// Funciones de conveniencia para usar desde Cursor
export const automation = new BlogAutomationPipeline();

/**
 * COMANDOS CURSOR SIMPLIFICADOS
 */

// Comando simple: generar un artículo
export async function createArticle(topic: string, category?: string, promotionIntensity?: PromotionIntensity, customPrompt?: string) {
  return await automation.generateAndPublishArticle(topic, category, promotionIntensity, customPrompt);
}

// Comando batch: generar múltiples artículos
export async function createArticleBatch(topics: string[], category?: string, promotionIntensity?: PromotionIntensity, customPrompt?: string) {
  return await automation.generateBatch(topics, category, promotionIntensity, customPrompt);
}

// Comando con temas predefinidos para SMM
export async function createSMMArticle(focusArea: 'instagram' | 'tiktok' | 'engagement' | 'growth' | 'algorithm', promotionIntensity?: PromotionIntensity, customPrompt?: string) {
  const topics = {
    instagram: 'Cómo conseguir más seguidores en Instagram orgánicamente',
    tiktok: 'Estrategias para viralizarse en TikTok en 2024',
    engagement: 'Trucos para aumentar el engagement en redes sociales',
    growth: 'Guía completa de crecimiento en redes sociales',
    algorithm: 'Cómo funciona el algoritmo de Instagram y TikTok'
  };

  const categories = {
    instagram: 'instagram-growth',
    tiktok: 'content-creation',
    engagement: 'engagement',
    growth: 'social-media-marketing',
    algorithm: 'algorithm'
  };

  return await automation.generateAndPublishArticle(
    topics[focusArea], 
    categories[focusArea],
    promotionIntensity,
    customPrompt
  );
} 