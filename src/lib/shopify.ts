// Configuración de la API de Shopify

// No incluimos la clave secreta en el código del cliente por seguridad
// La clave secreta solo debe usarse en el servidor

// Constantes de la API de Shopify
const SHOPIFY_STORE_URL = 'goviral-4810.myshopify.com';
const SHOPIFY_API_VERSION = '2023-10'; // Using a stable version that's definitely available

// GraphQL document for customer creation
const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation CreateCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        tags
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL document for shop query
const SHOP_QUERY = /* GraphQL */ `
  {
    shop {
      name
      id
    }
  }
`;

export interface ShopifyProduct {
  id: string;
  title: string;
  price: string;
  description: string;
  images: { src: string }[];
  variants: {
    id: string;
    title: string;
    price: string;
    available: boolean;
  }[];
}

export interface CartItem {
  variantId: string;
  quantity: number;
}

// Interfaz para la creación de clientes
export interface ShopifyCustomerInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string[];
  note?: string;
  emailMarketingConsent?: {
    marketingState: "SUBSCRIBED" | "NOT_SUBSCRIBED" | "UNSUBSCRIBED";
    marketingOptInLevel?: "SINGLE_OPT_IN" | "CONFIRMED_OPT_IN";
  };
  addresses?: {
    address1?: string;
    city?: string;
    province?: string;
    phone?: string;
    zip?: string;
    country?: string;
    firstName?: string;
    lastName?: string;
  }[];
}

// Función para obtener los productos de Shopify
export async function getProducts(): Promise<ShopifyProduct[]> {
  try {
    // En una implementación real, esta llamada se haría a través de un endpoint seguro del servidor
    // para no exponer las credenciales en el cliente
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// Función para crear un checkout
export async function createCheckout(items: CartItem[]): Promise<string> {
  try {
    // En una implementación real, esta llamada se haría a través de un endpoint seguro del servidor
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear checkout');
    }
    
    const { checkoutUrl } = await response.json();
    return checkoutUrl;
  } catch (error) {
    console.error('Error al crear checkout:', error);
    throw error;
  }
}

// Función para ejecutar una consulta GraphQL en la API de Shopify
async function executeGraphQL(
  query: string, 
  variables: any = {}, 
  apiToken: string
): Promise<any> {
  try {
    const shopifyGraphQLUrl = `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
    
    console.log('Executing GraphQL query:', {
      url: shopifyGraphQLUrl,
      apiVersion: SHOPIFY_API_VERSION,
      query: query.substring(0, 50) + '...',
    });
    
    const response = await fetch(shopifyGraphQLUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': apiToken,
        'X-Shopify-API-Version': SHOPIFY_API_VERSION
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    console.log('GraphQL response status:', response.status);
    
    const data = await response.text();
    let jsonData;
    
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('Error parsing GraphQL response:', data);
      throw new Error(`Error parsing GraphQL response: ${data}`);
    }
    
    if (jsonData.errors) {
      console.error('GraphQL errors:', jsonData.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(jsonData.errors)}`);
    }
    
    return jsonData.data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

// Función para verificar la conexión con la API de Shopify
export async function verifyShopifyConnection(
  apiToken: string
): Promise<{ success: boolean; error?: string; shop?: any }> {
  try {
    const data = await executeGraphQL(SHOP_QUERY, {}, apiToken);
    
    if (!data || !data.shop) {
      return {
        success: false,
        error: 'No se pudo obtener información de la tienda'
      };
    }
    
    console.log('Shopify store verification successful:', data.shop.name);
    return {
      success: true,
      shop: data.shop
    };
  } catch (error) {
    console.error('Error al verificar conexión con Shopify:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// Función para crear un cliente en Shopify
export async function createCustomer(
  customerInput: ShopifyCustomerInput,
  apiToken: string
): Promise<{ success: boolean; customerId?: string; error?: string }> {
  try {
    // Verificar la conexión con Shopify primero
    const verificationResult = await verifyShopifyConnection(apiToken);
    if (!verificationResult.success) {
      return {
        success: false,
        error: `Error de conexión con Shopify: ${verificationResult.error}`
      };
    }
    
    // Ejecutar la mutación para crear el cliente
    const data = await executeGraphQL(
      CUSTOMER_CREATE_MUTATION,
      { input: customerInput },
      apiToken
    );
    
    const { customer, userErrors } = data.customerCreate;
    
    // Verificar si hay errores de usuario
    if (userErrors && userErrors.length > 0) {
      console.error('Error al crear cliente en Shopify:', userErrors);
      return {
        success: false,
        error: `Error al crear cliente: ${JSON.stringify(userErrors)}`
      };
    }
    
    // Verificar si se creó el cliente correctamente
    if (!customer) {
      return {
        success: false,
        error: 'No se pudo crear el cliente'
      };
    }
    
    console.log('Shopify customer created successfully:', customer);
    return {
      success: true,
      customerId: customer.id
    };
  } catch (error) {
    console.error('Error al crear cliente en Shopify:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
