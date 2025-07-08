import { NextRequest, NextResponse } from 'next/server';
import { VideoScriptGeneratorService, type VideoScriptContext } from '@/lib/videoScriptGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validación de campos requeridos
    const requiredFields = ['topic', 'description', 'platform', 'duration', 'contentType', 'targetAudience', 'niche', 'goal', 'tone'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Campos requeridos faltantes',
          details: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validación de valores específicos
    const validPlatforms = ['instagram', 'tiktok', 'youtube', 'general'];
    const validDurations = ['15s', '30s', '60s'];
    const validContentTypes = ['educativo', 'entretenimiento', 'viral', 'promocional', 'storytelling'];
    const validGoals = ['engagement', 'ventas', 'awareness', 'educacion', 'viral'];
    const validTones = ['profesional', 'casual', 'divertido', 'inspiracional', 'provocativo'];

    if (!validPlatforms.includes(body.platform)) {
      return NextResponse.json(
        { 
          error: 'Plataforma inválida',
          details: `Las plataformas válidas son: ${validPlatforms.join(', ')}` 
        },
        { status: 400 }
      );
    }

    if (!validDurations.includes(body.duration)) {
      return NextResponse.json(
        { 
          error: 'Duración inválida',
          details: `Las duraciones válidas son: ${validDurations.join(', ')}` 
        },
        { status: 400 }
      );
    }

    if (!validContentTypes.includes(body.contentType)) {
      return NextResponse.json(
        { 
          error: 'Tipo de contenido inválido',
          details: `Los tipos válidos son: ${validContentTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    if (!validGoals.includes(body.goal)) {
      return NextResponse.json(
        { 
          error: 'Objetivo inválido',
          details: `Los objetivos válidos son: ${validGoals.join(', ')}` 
        },
        { status: 400 }
      );
    }

    if (!validTones.includes(body.tone)) {
      return NextResponse.json(
        { 
          error: 'Tono inválido',
          details: `Los tonos válidos son: ${validTones.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validaciones adicionales
    if (body.topic.length < 3) {
      return NextResponse.json(
        { 
          error: 'Tema muy corto',
          details: 'El tema debe tener al menos 3 caracteres' 
        },
        { status: 400 }
      );
    }

    if (body.description.length < 10) {
      return NextResponse.json(
        { 
          error: 'Descripción muy corta',
          details: 'Describe tu video con más detalle (mínimo 10 caracteres)' 
        },
        { status: 400 }
      );
    }

    if (body.targetAudience.length < 5) {
      return NextResponse.json(
        { 
          error: 'Audiencia objetivo muy vaga',
          details: 'Describe tu audiencia objetivo con más detalle (mínimo 5 caracteres)' 
        },
        { status: 400 }
      );
    }

    if (body.niche.length < 3) {
      return NextResponse.json(
        { 
          error: 'Nicho muy corto',
          details: 'El nicho debe tener al menos 3 caracteres' 
        },
        { status: 400 }
      );
    }

    // Crear contexto para el generador
    const context: VideoScriptContext = {
      topic: body.topic.trim(),
      description: body.description.trim(),
      platform: body.platform,
      duration: body.duration,
      contentType: body.contentType,
      targetAudience: body.targetAudience.trim(),
      niche: body.niche.trim(),
      goal: body.goal,
      tone: body.tone
    };

    console.log('📝 Iniciando generación de guiones:', context);

    // Generar guiones usando el servicio mejorado
    const service = new VideoScriptGeneratorService();
    const result = await service.generateVideoScripts(context);

    if (!result) {
      return NextResponse.json(
        { 
          error: 'Error en la generación',
          details: 'No se pudieron generar los guiones. Por favor intenta de nuevo.' 
        },
        { status: 500 }
      );
    }

    console.log(`✅ Generación exitosa: ${result.generatedScripts.length} guiones creados`);

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Guiones generados exitosamente',
      data: result
    });

  } catch (error) {
    console.error('❌ Error en API de generador de guiones:', error);
    
    // Manejo específico de errores de OpenAI
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'Error de configuración',
          details: 'Servicio temporalmente no disponible. Intenta más tarde.' 
        },
        { status: 503 }
      );
    }

    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes',
          details: 'Has superado el límite de solicitudes. Espera unos minutos e intenta de nuevo.' 
        },
        { status: 429 }
      );
    }

    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Tiempo de respuesta agotado',
          details: 'La generación está tomando más tiempo del esperado. Intenta con un tema más específico.' 
        },
        { status: 408 }
      );
    }

    // Error genérico
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: 'Ocurrió un error inesperado. Por favor intenta de nuevo.' 
      },
      { status: 500 }
    );
  }
} 