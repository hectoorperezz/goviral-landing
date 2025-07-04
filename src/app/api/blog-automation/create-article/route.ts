import { NextRequest, NextResponse } from 'next/server';
import { createArticle, createArticleBatch, createSMMArticle } from '@/lib/blogAutomation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, topic, topics, category, focusArea, promotionIntensity, customPrompt } = body;

    // Validar que tenemos OPENAI_API_KEY
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY no está configurado' },
        { status: 500 }
      );
    }

    let result;

    switch (type) {
      case 'single':
        if (!topic) {
          return NextResponse.json(
            { error: 'Topic es requerido para crear un artículo único' },
            { status: 400 }
          );
        }
        console.log(`🚀 Iniciando creación de artículo: ${topic}`);
        result = await createArticle(topic, category, promotionIntensity, customPrompt);
        break;

      case 'batch':
        if (!topics || !Array.isArray(topics) || topics.length === 0) {
          return NextResponse.json(
            { error: 'Topics array es requerido para crear batch de artículos' },
            { status: 400 }
          );
        }
        console.log(`🚀 Iniciando batch de ${topics.length} artículos`);
        result = await createArticleBatch(topics, category, promotionIntensity, customPrompt);
        break;

      case 'smm':
        if (!focusArea) {
          return NextResponse.json(
            { error: 'focusArea es requerido para artículos SMM predefinidos' },
            { status: 400 }
          );
        }
        console.log(`🚀 Iniciando artículo SMM: ${focusArea}`);
        result = await createSMMArticle(focusArea, promotionIntensity, customPrompt);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo no válido. Usa: single, batch, o smm' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      message: 'Artículo(s) generado(s) exitosamente'
    });

  } catch (error) {
    console.error('Error en blog automation API:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 