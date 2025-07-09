import OpenAI from 'openai';
import { put } from '@vercel/blob';

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

// Check if we're in development or have Blob token
const IS_DEV = process.env.NODE_ENV === 'development';
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// Paleta de colores GoViral
const GOVIRAL_COLOR_PALETTE = {
  primary: '#D64DAD', // rgb(214,77,173) - Rosa principal de GoViral
  secondary: '#F4666E', // rgb(244,102,110) - Rosa coral del gradiente
  accent: '#FFB6C1', // Light pink
  neutral: '#F8F9FA', // Off white
  soft: '#FFF0F5', // Lavender blush
  peach: '#FFCCCB', // Light coral
  cream: '#FFF8DC', // Cornsilk
};

export interface BlogImageRequest {
  topic: string;
  title: string;
  category: string;
  style?: 'minimal' | 'aesthetic' | 'modern' | 'cozy';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
}

/**
 * GENERADOR DE IMÁGENES PARA BLOG GOVIRAL
 * Crea imágenes minimalistas y estéticas con la paleta de colores de marca
 */
export class BlogImageGenerator {
  
  /**
   * Genera prompts optimizados para crear imágenes de blog cohesivas con la marca
   */
  private generateImagePrompt(request: BlogImageRequest): string {
    const baseStyle = `
Professional minimalist photography in soft pink and coral tones. 
Color palette: #D64DAD (primary pink), #F4666E (coral), #FFB6C1 (light pink), #FFF8DC (cream).
Clean, aesthetic, modern composition. Soft natural lighting. High quality, 4K resolution.
Aspect ratio 16:9 for blog header. No text overlay.
`;

         // Prompts específicos por categoría de contenido
     const categoryPrompts = {
       'instagram-growth': `
${baseStyle}
Subject: Modern smartphone displaying Instagram interface, placed on 
clean white marble desk with soft pink flowers, coffee cup, and minimal 
office supplies. Overhead flat lay view, no people visible. 
Aesthetic workspace styling with natural shadows.
`,
       
       'engagement': `
${baseStyle}
Subject: Rose gold laptop (closed) on white marble surface, 
surrounded by soft pink flowers, geometric objects, and coffee cup. 
Abstract composition representing digital engagement. 
No people, focus on objects and natural lighting.
`,
       
       'algorithm': `
${baseStyle}
Subject: Minimalist chess pieces arranged on clean white board, 
soft pink and white pieces creating strategic patterns. 
Abstract representation of algorithms and strategy. 
Clean geometric composition, no human elements.
`,
       
       'content-creation': `
${baseStyle}
Subject: Aesthetic flat lay of creative tools - pink notebooks, 
rose gold pens, smartphone, small plants in pink pots, 
geometric shapes. Overhead view, minimalist arrangement 
on white background. No people visible.
`,
       
       'social-media-marketing': `
${baseStyle}
Subject: Modern office desk setup with laptop, multiple smartphones 
showing social media interfaces, pink accent decorations, plants, 
and business objects. Clean overhead view of professional workspace. 
No people, focus on technology and business elements.
`,
       
       'tiktok': `
${baseStyle}
Subject: Ring light setup with smartphone mount on clean pink desk, 
aesthetic video creation workspace with soft lighting equipment. 
Modern content creation tools arranged minimally. 
No people, focus on equipment and aesthetic setup.
`,
       
       'youtube': `
${baseStyle}
Subject: Camera on tripod facing clean pink backdrop, 
professional lighting equipment arranged aesthetically. 
Modern video production workspace with minimal design. 
No people visible, focus on equipment and studio setup.
`,
       
       'default': `
${baseStyle}
Subject: Clean minimalist workspace with closed laptop, coffee cup, 
small plants in pink pots, and geometric objects. 
Soft natural lighting, aesthetic flat lay composition. 
No people, focus on workspace elements and styling.
`
     };

    // Estilos adicionales según la preferencia
    const styleModifiers = {
      minimal: 'Ultra minimalist, lots of white space, very clean lines',
      aesthetic: 'Dreamy, soft focus, Instagram-worthy, very photogenic',
      modern: 'Contemporary, sleek, professional, tech-forward',
      cozy: 'Warm, inviting, comfortable, homey but still clean'
    };

    const categoryPrompt = categoryPrompts[request.category as keyof typeof categoryPrompts] || categoryPrompts.default;
    const styleModifier = styleModifiers[request.style || 'aesthetic'];

         return `${categoryPrompt}

Style: ${styleModifier}

Important restrictions: NO PEOPLE, NO FACES, NO HANDS, NO HUMAN FIGURES visible in the image. 
Focus entirely on objects, workspaces, technology, and abstract elements.

Additional context: This image is for a blog post about "${request.topic}". 
The image should feel cohesive with GoViral's pink branding while being 
professional and appealing to social media marketers and content creators.

Technical specs: 16:9 aspect ratio, high resolution, professional photography style, 
no text or watermarks, no human elements, ready for blog featured image use.`;
  }

  /**
   * Genera imagen usando DALL-E 3
   */
  async generateFeaturedImage(request: BlogImageRequest): Promise<GeneratedImage> {
    try {
      const prompt = this.generateImagePrompt(request);
      
      console.log(`🎨 Generando imagen para: ${request.title}`);
      console.log(`📝 Prompt optimizado creado...`);

      const response = await getOpenAIClient().images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1792x1024", // 16:9 aspect ratio optimizado para blog headers
        quality: "hd",
        style: "natural", // Más realista para el estilo de GoViral
        n: 1,
      });

      const imageUrl = response.data?.[0]?.url;
      
      if (!imageUrl) {
        throw new Error('No se pudo generar la imagen');
      }

      console.log(`✅ Imagen generada exitosamente`);

      return {
        url: imageUrl,
        prompt: prompt,
        style: request.style || 'aesthetic'
      };

    } catch (error) {
      console.error('Error generando imagen:', error);
      throw new Error(`Error al generar imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Descarga y guarda la imagen usando Vercel Blob Storage (producción) o filesystem (desarrollo)
   */
  async downloadAndSaveImage(imageUrl: string, filename: string): Promise<string> {
    try {
      console.log(`⬇️ Descargando imagen desde DALL-E...`);
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Error downloading image: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      console.log(`✅ Imagen descargada (${Math.round(buffer.byteLength / 1024)}KB)`);

      // En producción, usar Vercel Blob Storage
      if (!IS_DEV && BLOB_TOKEN) {
        try {
          console.log(`☁️ Guardando imagen en Blob Storage: ${filename}`);
          console.log(`🔧 Entorno: Producción (Vercel)`);
          
          const blob = await put(`blog-images/${filename}`, buffer, {
            access: 'public',
            token: BLOB_TOKEN,
            addRandomSuffix: false
          });
          
          console.log(`✅ Imagen guardada en Blob Storage: ${blob.url}`);
          return blob.url;
          
        } catch (blobError) {
          console.error('❌ Error guardando en Blob Storage:', blobError);
          console.log(`🔄 Fallback: Usando URL original de DALL-E`);
          // Fallback a URL original si falla Blob Storage
          return imageUrl;
        }
      }
      
      // En desarrollo, usar filesystem local
      else {
        try {
          console.log(`📁 Guardando imagen localmente: ${filename}`);
          console.log(`🔧 Entorno: Desarrollo (Filesystem)`);
          
          const fs = require('fs');
          const path = require('path');
          
          // Asegurar que el directorio existe
          const publicImagesDir = path.join(process.cwd(), 'public', 'blog-images');
          if (!fs.existsSync(publicImagesDir)) {
            fs.mkdirSync(publicImagesDir, { recursive: true });
            console.log(`📂 Directorio creado: ${publicImagesDir}`);
          }
          
          const filePath = path.join(publicImagesDir, filename);
          fs.writeFileSync(filePath, Buffer.from(buffer));
          
          console.log(`✅ Imagen guardada localmente: /blog-images/${filename}`);
          // Retornar la ruta pública para usar en el blog
          return `/blog-images/${filename}`;
          
        } catch (fsError) {
          console.error('❌ Error guardando archivo local:', fsError);
          console.log(`🔄 Fallback: Usando URL original de DALL-E`);
          // Fallback a URL original si falla filesystem
          return imageUrl;
        }
      }
      
    } catch (error) {
      console.error('❌ Error descargando imagen:', error);
      console.log(`🔄 Fallback: Usando imagen placeholder`);
      // Si falla la descarga, retornar imagen placeholder
      return '/avatars/avatar3.png';
    }
  }

  /**
   * Genera nombre de archivo único para la imagen
   */
  generateImageFilename(title: string): string {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
    
    const timestamp = Date.now();
    return `${slug}-${timestamp}.png`;
  }
}

/**
 * Función de conveniencia para usar en el pipeline de automatización
 */
export async function generateBlogImage(
  topic: string, 
  title: string, 
  category: string,
  style: 'minimal' | 'aesthetic' | 'modern' | 'cozy' = 'aesthetic'
): Promise<string> {
  const generator = new BlogImageGenerator();
  
  const imageRequest: BlogImageRequest = {
    topic,
    title,
    category,
    style
  };
  
  try {
    // Generar la imagen
    const generatedImage = await generator.generateFeaturedImage(imageRequest);
    
    // Intentar descargar y guardar (Blob Storage o filesystem según entorno)
    const filename = generator.generateImageFilename(title);
    const savedImageUrl = await generator.downloadAndSaveImage(generatedImage.url, filename);
    
    return savedImageUrl;
    
  } catch (error) {
    console.error('Error en generateBlogImage:', error);
    // Retornar una imagen placeholder si falla
    return '/avatars/avatar3.png'; // Fallback a imagen existente
  }
} 