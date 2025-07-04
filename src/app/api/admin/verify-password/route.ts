import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Contraseña requerida' },
        { status: 400 }
      );
    }

    // Verificar contraseña usando variable de entorno
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Configuración de admin no encontrada' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Error en verificación de contraseña admin:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 