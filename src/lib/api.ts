// API constants
const API_URL = "https://justanotherpanel.com/api/v2";
const API_KEY = process.env.JUST_ANOTHER_PANEL_API_KEY || "";
const REEL_VIEWS_SERVICE_ID = 442;
const TRIAL_QUANTITY = 500;

interface OrderParams {
  link: string;
}

interface ApiResponse {
  error?: string;
  order?: number;
  success?: boolean;
  message?: string;
}

/**
 * Add an order for Instagram reel views
 * @param params Order parameters
 * @returns API response
 */
export async function addReelViewsOrder(params: OrderParams): Promise<ApiResponse> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: API_KEY,
        action: "add",
        service: REEL_VIEWS_SERVICE_ID,
        link: params.link,
        quantity: TRIAL_QUANTITY,
      }),
    });

    if (!response.ok) {
      return {
        error: `API request failed with status ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    
    if (data.error) {
      return {
        error: data.error,
        success: false,
      };
    }

    return {
      order: data.order,
      success: true,
      message: "Order placed successfully",
    };
  } catch (error) {
    console.error("Error adding reel views order:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      success: false,
    };
  }
}

/**
 * Validate if a URL is a valid Instagram reel URL
 * @param url URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidInstagramReelUrl(url: string): boolean {
  const instagramUrlRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/;
  return instagramUrlRegex.test(url);
}

/**
 * Store user information for potential follow-up
 * This is a placeholder function that would typically connect to a database or CRM
 * @param name User's name
 * @param email User's email
 * @param reelUrl Instagram reel URL
 */
export async function storeUserInformation(
  name: string,
  email: string,
  reelUrl: string
): Promise<void> {
  // In a real implementation, this would connect to a database or CRM
  // For now, we'll just log the information
  console.log("User information stored:", { name, email, reelUrl });
  
  // This function could be expanded to:
  // 1. Store user data in a database
  // 2. Add user to an email marketing list
  // 3. Create a customer record in a CRM
} 