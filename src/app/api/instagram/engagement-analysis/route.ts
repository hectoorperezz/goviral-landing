import { NextRequest, NextResponse } from 'next/server';
import { EngagementCalculatorService } from '@/lib/engagementCalculator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se requiere un nombre de usuario',
          message: 'Por favor proporciona un nombre de usuario de Instagram'
        },
        { status: 400 }
      );
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();

    if (!cleanUsername) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nombre de usuario inválido',
          message: 'El nombre de usuario proporcionado no es válido'
        },
        { status: 400 }
      );
    }

    console.log(`Analyzing engagement for username: ${cleanUsername}`);

    const engagementService = new EngagementCalculatorService();
    const analysisResult = await engagementService.analyzeProfile(cleanUsername);

    if (!analysisResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se pudo analizar el perfil',
          message: 'No se encontró el usuario o el perfil es privado. Verifica que el nombre de usuario sea correcto y que el perfil sea público.'
        },
        { status: 404 }
      );
    }

    console.log(`Successfully analyzed ${cleanUsername}: ${analysisResult.current_stats.engagement_rate.toFixed(2)}% engagement rate`);

    return NextResponse.json({
      success: true,
      data: analysisResult,
      message: 'Análisis de engagement completado exitosamente'
    });

  } catch (error) {
    console.error('Engagement analysis error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        message: 'Ocurrió un error al analizar el engagement. Por favor, inténtalo de nuevo más tarde.',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Engagement analysis endpoint is operational',
    timestamp: new Date().toISOString(),
  });
} 