import { NextResponse } from 'next/server';

// Estas claves deberían estar en variables de entorno en un entorno de producción
const SHOPIFY_STORE_URL = 'https://goviral-4810.myshopify.com';
// Using environment variables for secure access
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || '';

export async function GET() {
  try {
    // En una implementación real, usaríamos la API de Shopify GraphQL
    // para obtener los productos con más detalles
    // Usamos la versión más reciente de la API de Shopify
    const response = await fetch(`${SHOPIFY_STORE_URL}/admin/api/2023-10/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos de Shopify');
    }

    const data = await response.json();
    
    // Transformamos los datos para que coincidan con nuestra interfaz ShopifyProduct
    const products = data.products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.body_html,
      price: product.variants[0]?.price || '0.00',
      images: product.images || [],
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        available: variant.inventory_quantity > 0,
      })),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}
