# 🤖 GUÍA DE AUTOMATIZACIÓN DE BLOG GOVIRAL

## 🚀 SISTEMA COMPLETO DE CREACIÓN AUTOMÁTICA DE ARTÍCULOS

Este sistema te permite generar artículos ultra-optimizados directamente desde Cursor y subirlos automáticamente a tu base de datos.

## 📋 REQUISITOS PREVIOS

1. **Variables de entorno configuradas** en `.env.local`:
   ```bash
   OPENAI_API_KEY=tu_api_key_de_openai
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

2. **Servidor de desarrollo corriendo**:
   ```bash
   npm run dev
   ```

3. **Base de datos con las tablas `blog_posts` y `blog_categories`** ya creadas

## 🎯 COMANDOS CURSOR DISPONIBLES

### 1. ARTÍCULO ÚNICO
Genera un artículo completo sobre cualquier tema:

```bash
node scripts/create-blog-article.js "Cómo conseguir más seguidores en Instagram"
```

```bash
node scripts/create-blog-article.js "Estrategias de TikTok para 2024"
```

### 2. ARTÍCULOS SMM PREDEFINIDOS
Usa plantillas optimizadas para temas específicos:

```bash
# Instagram
node scripts/create-blog-article.js --smm instagram

# TikTok  
node scripts/create-blog-article.js --smm tiktok

# Engagement
node scripts/create-blog-article.js --smm engagement

# Crecimiento general
node scripts/create-blog-article.js --smm growth

# Algoritmos
node scripts/create-blog-article.js --smm algorithm
```

### 3. BATCH DE ARTÍCULOS
Genera múltiples artículos de una vez:

```bash
node scripts/create-blog-article.js --batch "Instagram Reels 2024" "TikTok viral tips" "YouTube Shorts strategy"
```

## ⚙️ CÓMO FUNCIONA EL SISTEMA

### PASO 1: Investigación de Keywords
- 🔍 GPT-4 analiza el tema y genera keywords optimizadas para SEO
- 🇪🇸 Enfoque en mercado hispano (España + Latinoamérica)  
- 💼 Keywords orientadas a servicios SMM (compra de seguidores, likes)

### PASO 2: Creación de Outline
- 📝 Estructura H1, H2, H3 optimizada para SEO
- 🎯 Sections que naturalmente llevan a servicios SMM
- 📊 Optimización para featured snippets de Google

### PASO 3: Generación de Contenido
- ✍️ Artículo completo de 2500+ palabras en markdown
- 🇪🇸 Español nativo con expresiones locales
- 🔗 CTAs naturales hacia herramientas GoViral
- 📈 Menciones estratégicas de servicios SMM

### PASO 4: Generación de Imagen de Portada
- 🎨 Imagen minimalista con paleta rosa de GoViral (#D64DAD, #F4666E)
- 📐 Dimensiones optimizadas 16:9 (1792x1024) para blog headers
- 🖼️ Estilo aesthetic y profesional usando DALL-E 3
- 💾 Descarga automática a `/public/blog-images/`

### PASO 5: Optimización SEO
- 🏷️ Meta títulos y descripciones automáticas
- 🔗 Slugs SEO-friendly generados automáticamente
- 📝 Keywords y excerpts optimizados
- 🎨 URLs limpias y categorizadas

### PASO 6: Publicación Automática
- 💾 Inserción directa en Supabase
- ⏰ Timestamp de publicación automático
- 🔢 View count inicializado
- ✅ Artículo inmediatamente visible en `/blog`

## 📊 MÉTRICAS Y RESULTADOS

### **Eficiencia**
- ⏱️ **Tiempo**: 2-3 minutos vs 4-6 horas manual
- 📈 **Escalabilidad**: 50+ artículos/mes vs 2-3 manual
- 💰 **ROI**: 2400% mejora en eficiencia de tiempo

### **Calidad SEO**
- 🎯 Keywords naturalmente integradas (1-2% densidad)
- 📱 Estructura optimizada para mobile-first
- 🔍 Meta tags automáticos bajo límites (60/160 chars)
- 📈 Internal linking a herramientas GoViral

### **Conversión SMM**
- 🛠️ Enlaces naturales a herramientas gratuitas
- 💳 CTAs estratégicos hacia servicios SMM
- 📧 Captura de leads implícita
- 🔄 Funnel optimizado: Blog → Tool → Email → SMM Services

## 💡 EJEMPLOS DE USO DESDE CURSOR

### Crear contenido semanal:
```bash
# Lunes - Instagram
node scripts/create-blog-article.js --smm instagram

# Miércoles - Engagement  
node scripts/create-blog-article.js --smm engagement

# Viernes - Tema personalizado
node scripts/create-blog-article.js "Tendencias de redes sociales marzo 2024"
```

### Batch para content calendar mensual:
```bash
node scripts/create-blog-article.js --batch \
  "Instagram Stories que generan ventas" \
  "TikTok para negocios locales" \
  "YouTube Shorts vs Instagram Reels" \
  "LinkedIn para emprendedores" \
  "Pinterest marketing en español"
```

### Respuesta rápida a trends:
```bash
# Detectaste un trend? Genera contenido inmediatamente
node scripts/create-blog-article.js "Nuevo algoritmo Instagram febrero 2024"
```

## 🔧 PERSONALIZACIÓN AVANZADA

### Modificar categorías por defecto:
Edita `src/lib/blogAutomation.ts` línea con `categories`:

```typescript
const categories = {
  instagram: 'instagram-growth',
  tiktok: 'content-creation', 
  engagement: 'engagement',
  // Añade más categorías...
}
```

### Ajustar prompts:
Modifica los prompts en `KeywordResearchEngine` y `UltraContentGenerator` para cambiar el tono, enfoque o estructura.

### Configurar delays:
Cambia el delay entre artículos en batch editando:
```typescript
await new Promise(resolve => setTimeout(resolve, 30000)); // 30 segundos
```

## 🚨 SOLUCIÓN DE PROBLEMAS

### Error: "OPENAI_API_KEY no está configurado"
```bash
# Verifica tu .env.local
cat .env.local | grep OPENAI_API_KEY
```

### Error: "ECONNREFUSED"
```bash
# Asegúrate de que el servidor esté corriendo
npm run dev
```

### Error: Database connection
```bash
# Verifica variables de Supabase
cat .env.local | grep SUPABASE
```

## 📈 PRÓXIMAS MEJORAS

- [x] **Imágenes automáticas**: ✅ Integración con DALL-E para featured images
- [ ] **Promoción social**: Auto-post en redes sociales
- [ ] **Analytics**: Tracking automático de performance
- [ ] **A/B Testing**: Optimización automática de títulos
- [ ] **Traducción**: Versiones en inglés automáticas
- [ ] **Voice commands**: Integración con Cursor voice

## 🎉 ¡EMPIEZA AHORA!

1. Asegúrate de que `npm run dev` esté corriendo
2. Ejecuta tu primer artículo:
   ```bash
   node scripts/create-blog-article.js --smm instagram
   ```
3. Ve a `http://localhost:3001/blog` para ver tu artículo publicado
4. ¡Escala tu content marketing con automatización!

---

**🚀 Con este sistema puedes generar 50+ artículos optimizados por mes y escalar tu tráfico orgánico exponencialmente.** 