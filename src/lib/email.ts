import nodemailer from 'nodemailer';

// Email configuration
// For production, use real SMTP credentials
// For development, we'll use a test account
const EMAIL_FROM = 'soporte@goviral.es';
const EMAIL_SUBJECT = 'Verifica tu email para GoViral';

// Office 365 SMTP configuration
const SMTP_CONFIG = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'soporte@goviral.es',
    pass: 'Palomita412+',
  },
};

// Create a test account for development
let testAccount: nodemailer.TestAccount | null = null;

/**
 * Get a nodemailer transporter
 * @returns A configured nodemailer transporter
 */
async function getTransporter() {
  // Use Office 365 SMTP configuration
  return nodemailer.createTransport(SMTP_CONFIG);
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
    const transporter = await getTransporter();
    
    // Create email HTML content
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
          
          <p>Este código expirará en 24 horas. Si no has solicitado esta verificación, puedes ignorar este correo.</p>
          
          <p>¡Gracias por elegir GoViral!</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} GoViral. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: `"GoViral" <${EMAIL_FROM}>`,
      to,
      subject: EMAIL_SUBJECT,
      html: htmlContent,
    });
    
    console.log('Verification email sent:', info.messageId);
    
    // For development, log the preview URL
    let previewUrl: string | undefined;
    if (testAccount) {
      const testMessageUrl = nodemailer.getTestMessageUrl(info);
      previewUrl = testMessageUrl ? testMessageUrl.toString() : undefined;
      console.log('Preview URL:', previewUrl);
    }
    
    return { 
      success: true, 
      info,
      previewUrl
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false };
  }
} 