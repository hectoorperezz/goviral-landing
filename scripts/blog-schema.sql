-- Blog System Database Schema for Supabase
-- Created for GoViral Landing Page Blog Implementation

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  seo_title VARCHAR(60),
  meta_description VARCHAR(160),
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  seo_title VARCHAR(60),
  meta_description VARCHAR(160),
  keywords TEXT[],
  category_id UUID REFERENCES blog_categories(id),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  author_name VARCHAR(100) DEFAULT 'GoViral Team',
  view_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- SEO and Performance indexes
  CONSTRAINT blog_posts_slug_check CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT blog_posts_title_length CHECK (char_length(title) >= 10),
  CONSTRAINT blog_posts_content_length CHECK (char_length(content) >= 100)
);

-- Blog Images Table (for media management)
CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  url TEXT NOT NULL,
  alt_text VARCHAR(200),
  caption TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  mime_type VARCHAR(50),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Full-text search index for blog content
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(
  to_tsvector('spanish', title || ' ' || COALESCE(excerpt, '') || ' ' || content)
);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at 
    BEFORE UPDATE ON blog_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update category post count
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update old category count
    IF OLD.category_id IS NOT NULL THEN
        UPDATE blog_categories 
        SET post_count = (
            SELECT COUNT(*) FROM blog_posts 
            WHERE category_id = OLD.category_id AND status = 'published'
        )
        WHERE id = OLD.category_id;
    END IF;
    
    -- Update new category count
    IF NEW.category_id IS NOT NULL THEN
        UPDATE blog_categories 
        SET post_count = (
            SELECT COUNT(*) FROM blog_posts 
            WHERE category_id = NEW.category_id AND status = 'published'
        )
        WHERE id = NEW.category_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to automatically update category post counts
CREATE TRIGGER update_category_count_on_post_change
    AFTER INSERT OR UPDATE OR DELETE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Function to increment view count (for RPC call)
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = post_id;
END;
$$ LANGUAGE 'plpgsql';

-- Insert initial categories
INSERT INTO blog_categories (name, slug, description, seo_title, meta_description) VALUES
('Instagram Growth', 'instagram-growth', 'Estrategias y técnicas para hacer crecer tu cuenta de Instagram de manera orgánica', 'Cómo hacer crecer Instagram - Guías y estrategias', 'Aprende las mejores estrategias para conseguir más seguidores en Instagram de manera orgánica y auténtica.'),
('TikTok Tips', 'tiktok-tips', 'Consejos y trucos para triunfar en TikTok y crear contenido viral', 'TikTok Tips - Cómo crear contenido viral', 'Descubre los secretos para crear contenido viral en TikTok y hacer crecer tu audiencia rápidamente.'),
('SMM Services', 'smm-services', 'Guía sobre servicios de marketing en redes sociales y cómo elegir los mejores', 'Servicios SMM - Marketing en Redes Sociales', 'Todo lo que necesitas saber sobre servicios de marketing en redes sociales para hacer crecer tu marca.'),
('Engagement', 'engagement', 'Técnicas y estrategias para aumentar la interacción en tus redes sociales', 'Cómo aumentar engagement en redes sociales', 'Estrategias probadas para aumentar la interacción y engagement en todas tus redes sociales.'),
('Algorithm', 'algorithm', 'Análisis y explicación de algoritmos de redes sociales', 'Algoritmos de redes sociales - Guía completa', 'Entiende cómo funcionan los algoritmos de Instagram, TikTok y otras redes sociales para optimizar tu contenido.');

-- Insert sample blog posts
INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    category_id, 
    tags, 
    status, 
    published_at,
    seo_title,
    meta_description,
    keywords,
    reading_time_minutes,
    view_count
) VALUES 
(
    'Cómo conseguir 1000 seguidores en Instagram en 30 días',
    'como-conseguir-1000-seguidores-instagram-30-dias',
    'Estrategias probadas para hacer crecer tu cuenta de Instagram de manera orgánica y auténtica.',
    'En esta guía completa te enseñaré las estrategias más efectivas para ganar 1000 seguidores reales en solo 30 días.

## Por qué es importante tener una estrategia

Muchas personas intentan hacer crecer sus cuentas de Instagram sin una estrategia clara. Esto resulta en crecimiento lento y seguidores de baja calidad. Una estrategia bien definida te permitirá:

- **Atraer a tu audiencia ideal**
- **Crear contenido que realmente conecte**
- **Optimizar tu tiempo y esfuerzo**
- **Construir una comunidad comprometida**

## Estrategia #1: Optimiza tu perfil completamente

Tu perfil es tu carta de presentación. Debe estar 100% optimizado:

### Bio perfecta
- Usa palabras clave de tu nicho
- Incluye una llamada a la acción clara
- Añade emojis para hacer tu bio más visual
- Incluye tu link principal

> **💡 Tip:** Utiliza nuestro [Generador de Bio con IA](/tools/instagram-bio-generator) para crear biografías optimizadas automáticamente.

### Foto de perfil profesional
- Usa una foto clara y de alta calidad
- Si es marca, usa tu logo
- Si es personal, muestra tu cara claramente

## Estrategia #2: Crea contenido de valor consistente

La clave del crecimiento orgánico es crear contenido que tu audiencia realmente quiera ver:

### Tipos de contenido que funcionan:
1. **Educativo**: Tutoriales, tips, guías
2. **Entretenimiento**: Memes, historias divertidas
3. **Inspiracional**: Citas, transformaciones
4. **Personal**: Behind the scenes, día a día

### Frecuencia de publicación:
- **Posts**: 1 vez al día mínimo
- **Stories**: 3-5 veces al día
- **Reels**: 3-4 veces por semana

## Usa hashtags estratégicamente

Los hashtags siguen siendo cruciales para el descubrimiento orgánico:

### Mix perfecto de hashtags:
- **5-7 hashtags populares** (100K+ posts)
- **10-15 hashtags medios** (10K-100K posts)  
- **10-13 hashtags nicho** (menos de 10K posts)

> **🔍 Herramienta recomendada:** Usa nuestro [Analizador de Hashtags](/tools/instagram-hashtag-analyzer) para encontrar los hashtags perfectos con datos en tiempo real.

## Plan de acción de 30 días

### Semana 1: Optimización
- [ ] Optimiza tu bio completamente
- [ ] Cambia foto de perfil si es necesario
- [ ] Planifica 30 días de contenido
- [ ] Investiga hashtags de tu nicho

### Semana 2: Contenido
- [ ] Publica 1 post al día
- [ ] Crea 3 Reels
- [ ] Interactúa 1 hora diaria
- [ ] Analiza métricas

### Semana 3: Engagement
- [ ] Colabora con 3 cuentas
- [ ] Aumenta Stories a 5 diarias
- [ ] Optimiza horarios de publicación
- [ ] Responde todos los comentarios

### Semana 4: Aceleración
- [ ] Duplica Reels a 6 por semana
- [ ] Organiza un Live
- [ ] Crea contenido trending
- [ ] Planifica mes siguiente

## Herramientas que te ayudarán

Para implementar esta estrategia de manera efectiva, te recomiendo usar nuestras herramientas gratuitas:

- **[Analizador de Hashtags](/tools/instagram-hashtag-analyzer)**: Encuentra hashtags con datos reales de Instagram
- **[Generador de Bio](/tools/instagram-bio-generator)**: Crea biografías optimizadas con IA
- **[Calculadora de Engagement](/tools/instagram-engagement-calculator)**: Analiza tu tasa de engagement

## Resultados esperados

Siguiendo esta estrategia consistentemente, puedes esperar:

- **Semana 1**: 50-100 seguidores nuevos
- **Semana 2**: 150-250 seguidores totales  
- **Semana 3**: 400-600 seguidores totales
- **Semana 4**: 800-1000+ seguidores totales

## ¿Necesitas acelerar tu crecimiento?

Si quieres **resultados más rápidos y garantizados**, considera nuestros servicios profesionales de SMM:

- ✅ **Seguidores reales y activos**
- ✅ **Aumento de engagement**  
- ✅ **Optimización del perfil**
- ✅ **Estrategia personalizada**

[Ver Servicios SMM →](https://goviral.es/collections)',
    (SELECT id FROM blog_categories WHERE slug = 'instagram-growth'),
    ARRAY['Instagram', 'Growth Hacking', 'Social Media', 'Marketing Digital'],
    'published',
    NOW() - INTERVAL '5 days',
    'Cómo conseguir 1000 seguidores en Instagram en 30 días - Guía 2024',
    'Estrategias probadas para ganar 1000 seguidores reales en Instagram en solo 30 días. Guía completa con plan de acción paso a paso.',
    ARRAY['instagram seguidores', 'como ganar seguidores instagram', 'estrategias instagram', 'crecimiento organico instagram'],
    8,
    1250
),
(
    '10 trucos para aumentar el engagement en Instagram',
    'trucos-aumentar-engagement-instagram',
    'Técnicas avanzadas para mejorar la interacción con tu audiencia y aumentar el alcance orgánico.',
    'El engagement es la clave del éxito en Instagram. En esta guía te enseño 10 trucos probados para aumentar la interacción con tu audiencia.

## ¿Qué es el engagement y por qué importa?

El engagement rate es el porcentaje de tu audiencia que interactúa con tu contenido. Instagram premia las cuentas con alto engagement mostrando su contenido a más personas.

## 10 Trucos para aumentar tu engagement

### 1. Publica en los horarios óptimos
Analiza cuándo tu audiencia está más activa y programa tus posts para esos momentos.

### 2. Usa CTAs (llamadas a la acción)
Termina tus posts preguntando algo específico a tu audiencia. "¿Cuál prefieres, A o B?"

### 3. Crea contenido que genere conversación
Posts controversiales (de manera respetuosa) generan más comentarios y debates.

### 4. Responde TODOS los comentarios
Especialmente en las primeras 2 horas. Esto indica a Instagram que tu contenido genera interacción.

### 5. Usa Stories interactivas
Encuestas, preguntas, quizzes... las Stories son perfectas para generar engagement.

### 6. Colabora con otros creators
Los intercambios de comentarios y colaboraciones aumentan tu alcance y engagement.

### 7. Crea contenido educativo
Los tutoriales y tips se guardan más, lo que cuenta como engagement para Instagram.

### 8. Usa hashtags estratégicos
No solo populares, sino específicos de tu nicho para atraer audiencia interesada.

### 9. Publica Reels consistentemente
Los Reels tienen mayor alcance orgánico y generan más interacciones.

### 10. Analiza y optimiza
Usa Instagram Insights para entender qué tipo de contenido genera más engagement.

## Métricas que debes monitorear

- **Engagement Rate**: Objetivo mínimo 3%
- **Alcance**: Debe crecer consistentemente
- **Guardados**: Indica contenido de valor
- **Shares**: Muestra que tu contenido es viral-worthy

## Herramientas recomendadas

- **[Calculadora de Engagement](/tools/instagram-engagement-calculator)**: Analiza tu tasa actual
- **[Analizador de Hashtags](/tools/instagram-hashtag-analyzer)**: Encuentra hashtags que generen engagement

¿Necesitas ayuda profesional? [Descubre nuestros servicios SMM](https://goviral.es/collections) para acelerar tu crecimiento.',
    (SELECT id FROM blog_categories WHERE slug = 'engagement'),
    ARRAY['Engagement', 'Instagram Tips', 'Social Media Marketing'],
    'published',
    NOW() - INTERVAL '3 days',
    '10 trucos para aumentar el engagement en Instagram - Guía 2024',
    'Técnicas avanzadas para mejorar la interacción con tu audiencia y aumentar el alcance orgánico en Instagram.',
    ARRAY['engagement instagram', 'como aumentar engagement', 'interaccion instagram'],
    6,
    980
),
(
    'Guía completa del algoritmo de Instagram 2024',
    'guia-algoritmo-instagram-2024',
    'Todo lo que necesitas saber sobre cómo funciona el algoritmo de Instagram en 2024.',
    'El algoritmo de Instagram ha evolucionado significativamente en 2024. En esta guía completa te explico cómo funciona y cómo optimizar tu contenido.

## Cómo funciona el algoritmo de Instagram en 2024

Instagram usa machine learning para decidir qué contenido mostrar a cada usuario. Los factores principales son:

### 1. Relación con el usuario
- Cuentas con las que más interactúas
- Perfiles que visitas frecuentemente
- Personas que te envían DMs

### 2. Información sobre el post
- Popularidad (likes, comentarios, shares)
- Cuándo se publicó
- Duración del video
- Ubicación (si está etiquetada)

### 3. Actividad del usuario
- Posts que le han gustado recientemente
- Tipo de contenido que consume más
- Tiempo que pasa en la app

### 4. Historial de interacciones
- Frecuencia de interacción con el creator
- Tipo de interacciones (likes, comentarios, DMs)

## Factores de ranking por formato

### Feed Posts
- **Engagement temprano** (primeras 2 horas)
- **Tiempo de permanencia** en el post
- **Shares** a Stories o DMs
- **Guardados** del contenido

### Reels
- **Tasa de finalización** del video
- **Re-watches** (cuántas veces se ve)
- **Audio trending** que uses
- **Engagement rate** general

### Stories
- **Tiempo de visualización** completa
- **Interacciones** (polls, questions)
- **DMs** generados por la Story
- **Taps hacia adelante vs atrás**

## Estrategias para optimizar el algoritmo

### 1. Crea contenido de calidad
El algoritmo premia el contenido que mantiene a los usuarios en la plataforma.

### 2. Publica consistentemente
La regularidad indica al algoritmo que eres un creator activo.

### 3. Fomenta la interacción temprana
Las primeras 2 horas son críticas. Notifica a tu audiencia cuando publiques.

### 4. Usa todos los formatos
Posts, Reels, Stories, Live... diversifica tu contenido.

### 5. Analiza tus métricas
Instagram Insights te muestra qué funciona mejor con tu audiencia.

## Errores que penalizan tu alcance

- **Comprar engagement falso**
- **Usar hashtags prohibidos**
- **Repostear contenido sin permiso**
- **Spam en comentarios**
- **Violar las community guidelines**

## Herramientas para optimizar tu estrategia

- **[Analizador de Hashtags](/tools/instagram-hashtag-analyzer)**: Encuentra hashtags optimizados para el algoritmo
- **[Calculadora de Engagement](/tools/instagram-engagement-calculator)**: Mide tu performance actual

El algoritmo cambia constantemente, pero estos principios fundamentales se mantienen. ¿Necesitas ayuda profesional? [Descubre nuestros servicios](https://goviral.es/collections).',
    (SELECT id FROM blog_categories WHERE slug = 'algorithm'),
    ARRAY['Instagram Algorithm', 'Social Media Strategy', 'Content Optimization'],
    'published',
    NOW() - INTERVAL '1 day',
    'Algoritmo de Instagram 2024 - Guía completa y actualizada',
    'Descubre cómo funciona el algoritmo de Instagram en 2024 y optimiza tu contenido para mayor alcance y engagement.',
    ARRAY['algoritmo instagram 2024', 'como funciona instagram', 'algoritmo redes sociales'],
    12,
    2100
);

-- Update category post counts
UPDATE blog_categories SET post_count = (
    SELECT COUNT(*) FROM blog_posts 
    WHERE blog_posts.category_id = blog_categories.id AND status = 'published'
);

-- Grant permissions (adjust based on your RLS policies)
-- You may need to set up Row Level Security (RLS) policies in Supabase

COMMENT ON TABLE blog_posts IS 'Stores all blog posts for the GoViral website';
COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';
COMMENT ON TABLE blog_images IS 'Media files associated with blog posts'; 