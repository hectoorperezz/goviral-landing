import { NextRequest, NextResponse } from 'next/server';
import { SimpleHashtagAnalyzerService } from '@/lib/hashtagAnalyzerSimple';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Hashtag analyzer API endpoint called');

    // Parse request body
    const body = await request.json();
    const { contentType, targetAudience, contentDescription, goal, industry } = body;

    // Validate required fields
    if (!contentType || !targetAudience || !contentDescription) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: contentType, targetAudience, contentDescription',
          details: 'Todos los campos son requeridos para generar hashtags personalizados'
        },
        { status: 400 }
      );
    }

    // Validate content length
    if (contentDescription.length < 10) {
      return NextResponse.json(
        { 
          error: 'Content description too short',
          details: 'La descripción del contenido debe tener al menos 10 caracteres'
        },
        { status: 400 }
      );
    }

    if (contentDescription.length > 500) {
      return NextResponse.json(
        { 
          error: 'Content description too long',
          details: 'La descripción del contenido no puede exceder 500 caracteres'
        },
        { status: 400 }
      );
    }

    // Create analyzer service
    const analyzer = new SimpleHashtagAnalyzerService();

    // Analyze hashtags
    const result = await analyzer.analyzeContentHashtags({
      contentType: contentType.trim(),
      targetAudience: targetAudience.trim(),
      contentDescription: contentDescription.trim(),
      goal: goal || 'engagement',
      industry: industry || 'general'
    });

    if (!result) {
      return NextResponse.json(
        { 
          error: 'Analysis failed',
          details: 'No se pudo completar el análisis de hashtags. Por favor, inténtalo de nuevo.'
        },
        { status: 500 }
      );
    }

    console.log('✅ Hashtag analysis completed successfully');

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      message: 'Análisis de hashtags completado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in hashtag analyzer API:', error);

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: 'Error interno del servidor. Por favor, inténtalo de nuevo en unos momentos.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'GoViral Hashtag Analyzer API - Simplified Version',
    version: '1.0.0',
    description: 'AI-powered hashtag generation and Instagram analysis (No Database Required)',
    endpoints: {
      analyze: 'POST /api/hashtag-analyzer/analyze'
    },
    requiredEnvVars: [
      'OPENAI_API_KEY',
      'RAPIDAPI_KEY'
    ],
    features: [
      'AI-powered hashtag generation',
      'Real-time Instagram data analysis',
      'Strategic recommendations',
      'Success probability calculation',
      'No database dependencies'
    ]
  });
} 