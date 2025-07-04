import { NextRequest } from 'next/server';
import { SimpleHashtagAnalyzerService } from '@/lib/hashtagAnalyzerSimple';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Hashtag analyzer streaming API endpoint called');

    // Parse request body
    const body = await request.json();
    const { contentType, targetAudience, contentDescription, goal, industry } = body;

    // Validate required fields
    if (!contentType || !targetAudience || !contentDescription) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Todos los campos son requeridos'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Helper function to send SSE message
        const sendMessage = (data: any) => {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        try {
          // Send initial message
          sendMessage({
            type: 'progress',
            step: '🤖 Generando hashtags personalizados con IA...',
            progress: 5,
            estimatedTime: '2-3 minutos'
          });

          // Create analyzer service with progress callback
          const analyzer = new SimpleHashtagAnalyzerService();

          // Step 1: Generate hashtags with AI
          const generatedHashtags = await analyzer.generateHashtagsWithAI({
            contentType: contentType.trim(),
            targetAudience: targetAudience.trim(),
            contentDescription: contentDescription.trim(),
            goal: goal || 'engagement',
            industry: industry || 'general'
          });

          if (!generatedHashtags || generatedHashtags.length === 0) {
            throw new Error('Failed to generate hashtags with AI');
          }

          sendMessage({
            type: 'progress',
            step: '📊 Analizando datos de Instagram en tiempo real...',
            progress: 25,
            estimatedTime: '1-2 minutos',
            generatedCount: generatedHashtags.length
          });

          // Step 2: Analyze hashtags with progress updates
          const analyzedHashtags = await analyzer.analyzeHashtagsWithProgress(
            generatedHashtags,
            (current: number, total: number, currentHashtag: string) => {
              const hashtagProgress = 25 + (current / total) * 55; // 25% to 80%
              sendMessage({
                type: 'progress',
                step: `📊 Analizando #${currentHashtag} (${current}/${total})`,
                progress: Math.round(hashtagProgress),
                estimatedTime: current < total ? `${Math.ceil((total - current) * 1.5 / 60)} minuto(s)` : '30 segundos',
                currentHashtag,
                analyzedCount: current,
                totalCount: total
              });
            }
          );

          sendMessage({
            type: 'progress',
            step: '⚡ Calculando métricas y recomendaciones...',
            progress: 85,
            estimatedTime: '30 segundos'
          });

          // Step 3: Generate recommendations
          const recommendations = analyzer.generateStrategicRecommendations(analyzedHashtags, {
            contentType: contentType.trim(),
            targetAudience: targetAudience.trim(),
            contentDescription: contentDescription.trim(),
            goal: goal || 'engagement',
            industry: industry || 'general'
          });

          sendMessage({
            type: 'progress',
            step: '✅ ¡Análisis completado!',
            progress: 100,
            estimatedTime: '¡Listo!'
          });

          // Send final result
          const result = {
            generatedHashtags,
            analyzedHashtags,
            recommendedMix: recommendations.recommendedMix,
            strategicRecommendations: recommendations.strategicRecommendations,
            lastAnalyzedAt: new Date().toISOString()
          };

          sendMessage({
            type: 'complete',
            data: result,
            message: 'Análisis de hashtags completado exitosamente'
          });

          console.log('✅ Hashtag analysis streaming completed successfully');

        } catch (error) {
          console.error('❌ Error in streaming hashtag analysis:', error);
          sendMessage({
            type: 'error',
            error: 'Error interno del servidor',
            details: 'Por favor, inténtalo de nuevo en unos momentos.'
          });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ Error in streaming hashtag analyzer API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'Error interno del servidor'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 