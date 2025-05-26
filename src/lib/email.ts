import nodemailer from 'nodemailer';

// Email configuration
// For production, use real SMTP credentials
// For development, we'll use a test account
const EMAIL_FROM = process.env.EMAIL_FROM || 'soporte@goviral.es';
const EMAIL_SUBJECT = 'Verifica tu email para GoViral';
const DISCOUNT_CODE = 'PRUEBAREEL50';
const DISCOUNT_DESCRIPTION = '50% de descuento en tu próxima compra';

// Office 365 SMTP configuration
// Note: If emails are not being delivered, check that:
// 1. The password is correct and hasn't expired
// 2. 2FA is not enabled on the account (or app password is used)
// 3. SMTP is enabled for the account
// 4. The account isn't being rate limited
const SMTP_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.office365.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'soporte@goviral.es',
    pass: process.env.EMAIL_PASSWORD || '',
  },
  // Increase timeout to allow for slower connections
  connectionTimeout: 10000,
  // Add debug option for troubleshooting
  debug: process.env.NODE_ENV === 'development',
};

// Flag to use the test email account (Ethereal)
// Set this to false to always use the real SMTP configuration
const USE_TEST_ACCOUNT = process.env.USE_TEST_ACCOUNT === 'true';

// Check if we're in development mode
const IS_DEV = process.env.NODE_ENV === 'development';

// Create a test account for development
let testAccount: nodemailer.TestAccount | null = null;

/**
 * Get a nodemailer transporter
 * @returns A configured nodemailer transporter
 */
async function getTransporter() {
  // Use test account only if explicitly requested and in development mode
  if (IS_DEV && USE_TEST_ACCOUNT) {
    console.log('[email] Using Ethereal test email account for development');
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
      console.log('[email] Created test email account:', testAccount.user);
    }

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Otherwise, use the configured SMTP settings
  try {
    console.log('[email] Using real SMTP configuration:', {
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: SMTP_CONFIG.secure,
      user: SMTP_CONFIG.auth.user,
      // Don't log the password
    });
    
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    // Verify connection configuration
    await transporter.verify();
    console.log('[email] SMTP connection verified successfully');
    
    return transporter;
  } catch (error) {
    console.error('[email] Error verifying SMTP connection:', error);
    
    // If you need a fallback option, consider using SendGrid or similar:
    if (process.env.SENDGRID_API_KEY) {
      console.log('[email] Falling back to SendGrid email service');
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    }
    
    // For now, still return the original transporter and let it fail on send
    // This way we get more detailed error messages
    return nodemailer.createTransport(SMTP_CONFIG);
  }
}

/**
 * Send a verification email
 * @param to Recipient email address
 * @param name Recipient name
 * @param verificationCode Verification code
 * @returns Object indicating if email was sent successfully and any additional info
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationCode: string
): Promise<{ success: boolean; info?: any; previewUrl?: string }> {
  try {
    // For development, we can mock the email sending if requested
    if (IS_DEV && process.env.MOCK_EMAILS === 'true') {
      console.log('[email] MOCK EMAIL SENDING:', {
        to,
        name,
        verificationCode,
      });
      
      // Return a mock success response
      return {
        success: true,
        info: { messageId: 'mock-message-id-' + Date.now() },
        previewUrl: `http://localhost:3000/mock-email-preview?code=${verificationCode}`
      };
    }
    
    const transporter = await getTransporter();
    
    // Create email HTML content with clear instructions about checking spam folders
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          .code-container {
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #eee;
          }
          .verification-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #d64dad;
          }
          .promo-container {
            background: linear-gradient(90deg, #ffba08, #ff6b6b, #d64dad);
            border-radius: 10px;
            padding: 2px;
            margin: 30px 0;
          }
          .promo-content {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .promo-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .promo-code {
            font-family: monospace;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            background-color: #f2f2f2;
            color: #d64dad;
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px dashed #ccc;
            display: inline-block;
            margin: 10px 0;
          }
          .promo-description {
            color: #666;
            margin-top: 10px;
            font-size: 14px;
          }
          .spam-notice {
            background-color: #fff9e6;
            border-radius: 8px;
            padding: 12px;
            margin: 20px 0;
            border: 1px solid #ffe0b2;
            font-size: 14px;
          }
          .footer {
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1 style="color: #d64dad;">GoViral</h1>
          </div>
          
          <p>Hola ${name},</p>
          
          <p>Gracias por probar nuestro servicio de visualizaciones para Instagram. Para verificar tu email y recibir 500 visualizaciones gratis en tu reel, por favor utiliza el siguiente código:</p>
          
          <div class="code-container">
            <p class="verification-code">${verificationCode}</p>
          </div>
          
          <div class="spam-notice">
            <strong>¿No ves el correo?</strong> Por favor, revisa tu carpeta de spam o correo no deseado. A veces nuestros correos pueden acabar allí.
          </div>
          
          <p>Este código expirará en 24 horas. Si no has solicitado esta verificación, puedes ignorar este correo.</p>
          
          <!-- Promotion Code Section -->
          <div class="promo-container">
            <div class="promo-content">
              <div class="promo-title">¿Te ha gustado la prueba?</div>
              <p>Usa este código para obtener un <strong>${DISCOUNT_DESCRIPTION}</strong></p>
              <div class="promo-code">${DISCOUNT_CODE}</div>
              <div class="promo-description">Válido por 7 días en <a href="https://goviral.es" style="color: #d64dad; text-decoration: none;">goviral.es</a></div>
            </div>
          </div>
          
          <p>¡Gracias por elegir GoViral!</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} GoViral. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Log detailed information about the email being sent
    console.log(`[email] Attempting to send verification email to ${to}`);
    
    // Send email
    const info = await transporter.sendMail({
      from: `"GoViral" <${EMAIL_FROM}>`,
      to,
      subject: EMAIL_SUBJECT,
      html: htmlContent,
    });
    
    console.log('[email] Verification email sent:', info.messageId);
    
    // For development, log the preview URL
    let previewUrl: string | undefined;
    if (testAccount) {
      const testMessageUrl = nodemailer.getTestMessageUrl(info);
      previewUrl = testMessageUrl ? testMessageUrl.toString() : undefined;
      console.log('[email] Preview URL:', previewUrl);
    }
    
    return { 
      success: true, 
      info,
      previewUrl
    };
  } catch (error) {
    console.error('[email] Error sending verification email:', error);
    
    // Try to provide more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[email] Email error details:', {
      to,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return { 
      success: false,
      info: {
        error: errorMessage,
        // If you want to return a user-friendly message about checking spam:
        userMessage: "Si no recibes el correo, por favor revisa tu carpeta de spam o correo no deseado."
      }
    };
  }
} 