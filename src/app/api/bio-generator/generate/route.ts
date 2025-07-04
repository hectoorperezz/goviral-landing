import { NextRequest, NextResponse } from 'next/server';
import { InstagramBioGeneratorService } from '@/lib/bioGeneratorSimple';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Bio generator API endpoint called');

    // Parse request body
    const body = await request.json();
    const { 
      accountType, 
      niche, 
      targetAudience, 
      primaryGoal, 
      personalityTone,
      servicesProducts,
      website,
      location,
      languagePreference
    } = body;

    // Validate required fields
    if (!accountType || !niche || !targetAudience || !primaryGoal || !personalityTone) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Los campos tipo de cuenta, nicho, audiencia, objetivo y tono son requeridos',
          requiredFields: ['accountType', 'niche', 'targetAudience', 'primaryGoal', 'personalityTone']
        },
        { status: 400 }
      );
    }

    // Validate account type
    const validAccountTypes = ['personal', 'business', 'influencer', 'artist', 'creator'];
    if (!validAccountTypes.includes(accountType)) {
      return NextResponse.json(
        { 
          error: 'Invalid account type',
          details: 'Tipo de cuenta inválido. Debe ser: personal, business, influencer, artist, o creator'
        },
        { status: 400 }
      );
    }

    // Validate primary goal
    const validGoals = ['followers', 'sales', 'branding', 'community', 'awareness'];
    if (!validGoals.includes(primaryGoal)) {
      return NextResponse.json(
        { 
          error: 'Invalid primary goal',
          details: 'Objetivo inválido. Debe ser: followers, sales, branding, community, o awareness'
        },
        { status: 400 }
      );
    }

    // Validate personality tone
    const validTones = ['professional', 'casual', 'funny', 'inspirational', 'edgy'];
    if (!validTones.includes(personalityTone)) {
      return NextResponse.json(
        { 
          error: 'Invalid personality tone',
          details: 'Tono inválido. Debe ser: professional, casual, funny, inspirational, o edgy'
        },
        { status: 400 }
      );
    }

    // Validate content length
    if (niche.length < 3) {
      return NextResponse.json(
        { 
          error: 'Niche too short',
          details: 'El nicho debe tener al menos 3 caracteres'
        },
        { status: 400 }
      );
    }

    if (niche.length > 100) {
      return NextResponse.json(
        { 
          error: 'Niche too long',
          details: 'El nicho no puede exceder 100 caracteres'
        },
        { status: 400 }
      );
    }

    if (targetAudience.length < 5) {
      return NextResponse.json(
        { 
          error: 'Target audience too short',
          details: 'La descripción de audiencia debe tener al menos 5 caracteres'
        },
        { status: 400 }
      );
    }

    if (targetAudience.length > 200) {
      return NextResponse.json(
        { 
          error: 'Target audience too long',
          details: 'La descripción de audiencia no puede exceder 200 caracteres'
        },
        { status: 400 }
      );
    }

    // Validate optional fields if provided
    if (servicesProducts && servicesProducts.length > 300) {
      return NextResponse.json(
        { 
          error: 'Services/products description too long',
          details: 'La descripción de servicios/productos no puede exceder 300 caracteres'
        },
        { status: 400 }
      );
    }

    if (website && !/^https?:\/\/.+/.test(website)) {
      return NextResponse.json(
        { 
          error: 'Invalid website URL',
          details: 'El sitio web debe ser una URL válida (debe comenzar con http:// o https://)'
        },
        { status: 400 }
      );
    }

    // Create bio generator service
    const generator = new InstagramBioGeneratorService();

    // Generate bios
    const result = await generator.generateBios({
      accountType: accountType.trim(),
      niche: niche.trim(),
      targetAudience: targetAudience.trim(),
      primaryGoal,
      personalityTone,
      servicesProducts: servicesProducts?.trim(),
      website: website?.trim(),
      location: location?.trim(),
      languagePreference: languagePreference || 'spanish'
    });

    if (!result) {
      return NextResponse.json(
        { 
          error: 'Bio generation failed',
          details: 'No se pudieron generar las biografías. Por favor, inténtalo de nuevo.'
        },
        { status: 500 }
      );
    }

    console.log('✅ Bio generation completed successfully');

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      message: 'Biografías generadas exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in bio generator API:', error);

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
    message: 'GoViral Instagram Bio Generator API',
    version: '1.0.0',
    description: 'AI-powered Instagram bio generation with multiple styles and strategic insights',
    endpoints: {
      generate: 'POST /api/bio-generator/generate'
    },
    requiredEnvVars: [
      'OPENAI_API_KEY'
    ],
    features: [
      'AI-powered bio generation',
      '5 different bio styles',
      'Strategic insights and recommendations',
      'Spanish and English support',
      'Character count optimization',
      'CTA and keyword analysis'
    ],
    bioTypes: [
      'minimalist - Clean and professional',
      'emoji_rich - Visual and expressive',
      'list_format - Organized with bullet points',
      'storytelling - Personal narrative approach',
      'cta_focused - Conversion-optimized'
    ],
    supportedAccountTypes: ['personal', 'business', 'influencer', 'artist', 'creator'],
    supportedGoals: ['followers', 'sales', 'branding', 'community', 'awareness'],
    supportedTones: ['professional', 'casual', 'funny', 'inspirational', 'edgy']
  });
} 