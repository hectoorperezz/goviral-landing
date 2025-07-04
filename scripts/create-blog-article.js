#!/usr/bin/env node

/**
 * SCRIPT DE AUTOMATIZACIÓN DE BLOG PARA CURSOR
 * 
 * Uso desde terminal:
 * node scripts/create-blog-article.js "tema del artículo"
 * node scripts/create-blog-article.js "Cómo conseguir seguidores en TikTok"
 * 
 * Para batch de artículos:
 * node scripts/create-blog-article.js --batch "tema1" "tema2" "tema3"
 * 
 * Para artículos SMM predefinidos:
 * node scripts/create-blog-article.js --smm instagram
 * node scripts/create-blog-article.js --smm tiktok
 * node scripts/create-blog-article.js --smm engagement
 */

const https = require('https');
const url = require('url');

// Configuración
const BASE_URL = 'http://localhost:3001'; // Cambia si usas otro puerto
const API_ENDPOINT = '/api/blog-automation/create-article';

async function callAPI(data) {
  return new Promise((resolve, reject) => {
    const apiUrl = new URL(API_ENDPOINT, BASE_URL);
    
    const options = {
      hostname: apiUrl.hostname,
      port: apiUrl.port || (apiUrl.protocol === 'https:' ? 443 : 80),
      path: apiUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = (apiUrl.protocol === 'https:' ? https : require('http')).request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(new Error(`Error parsing response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🤖 AUTOMATIZACIÓN DE BLOG GOVIRAL

Comandos disponibles:

1. Artículo único:
   node scripts/create-blog-article.js "tema del artículo"
   
2. Batch de artículos:
   node scripts/create-blog-article.js --batch "tema1" "tema2" "tema3"
   
3. Artículos SMM predefinidos:
   node scripts/create-blog-article.js --smm instagram
   node scripts/create-blog-article.js --smm tiktok
   node scripts/create-blog-article.js --smm engagement
   node scripts/create-blog-article.js --smm growth
   node scripts/create-blog-article.js --smm algorithm

Ejemplos:
   node scripts/create-blog-article.js "Cómo conseguir más seguidores en Instagram"
   node scripts/create-blog-article.js --smm instagram
   node scripts/create-blog-article.js --batch "TikTok viral 2024" "YouTube Shorts tips"
`);
    return;
  }

  try {
    let requestData;

    if (args[0] === '--batch') {
      // Batch de artículos
      const topics = args.slice(1);
      if (topics.length === 0) {
        console.error('❌ Error: Proporciona al menos un tema para el batch');
        return;
      }
      
      requestData = {
        type: 'batch',
        topics: topics,
        category: 'social-media-marketing'
      };
      
      console.log(`🚀 Generando batch de ${topics.length} artículos...`);
      
    } else if (args[0] === '--smm') {
      // Artículo SMM predefinido
      const focusArea = args[1];
      if (!focusArea) {
        console.error('❌ Error: Especifica el área de enfoque (instagram, tiktok, engagement, growth, algorithm)');
        return;
      }
      
      requestData = {
        type: 'smm',
        focusArea: focusArea
      };
      
      console.log(`🚀 Generando artículo SMM sobre ${focusArea}...`);
      
    } else {
      // Artículo único
      const topic = args.join(' ');
      
      requestData = {
        type: 'single',
        topic: topic,
        category: 'social-media-marketing'
      };
      
      console.log(`🚀 Generando artículo sobre: "${topic}"...`);
    }

    console.log('⏱️ Esto puede tomar 2-3 minutos...\n');

    const response = await callAPI(requestData);

    if (response.success) {
      console.log('✅ ¡Éxito!');
      
      if (requestData.type === 'single' || requestData.type === 'smm') {
        const result = response.result;
        const article = result.article;
        console.log(`
📝 Artículo creado:
   Título: ${article?.title || 'N/A'}
   Slug: ${article?.slug || 'N/A'}
   ID: ${result?.articleId || 'N/A'}
   
🔗 Ver en: ${BASE_URL}/blog/${article?.slug || ''}
`);
      } else if (requestData.type === 'batch') {
        const results = response.result;
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(`
📊 Resultados del batch:
   ✅ Exitosos: ${successful}
   ❌ Fallidos: ${failed}
   📝 Total: ${results.length}
`);
        
        results.forEach((result, index) => {
          const status = result.success ? '✅' : '❌';
          console.log(`   ${status} ${result.topic}`);
          if (result.error) {
            console.log(`      Error: ${result.error}`);
          }
        });
      }
      
    } else {
      console.error('❌ Error:', response.error);
      if (response.details) {
        console.error('   Detalles:', response.details);
      }
    }

  } catch (error) {
    console.error('❌ Error ejecutando el script:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error(`
🔍 Posibles soluciones:
1. Asegúrate de que el servidor Next.js esté corriendo:
   npm run dev
   
2. Verifica que esté corriendo en ${BASE_URL}
   
3. Revisa que tengas OPENAI_API_KEY configurado en .env.local
`);
    }
  }
}

main().catch(console.error); 