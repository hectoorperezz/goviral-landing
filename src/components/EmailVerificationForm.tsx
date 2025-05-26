"use client";

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";

// Extend Window interface to include trackGA function
declare global {
  interface Window {
    trackGA?: (action: string, label: string) => void;
  }
}

interface EmailVerificationFormProps {
  email: string;
  name?: string;
  reelUrl?: string;
  onVerificationSuccess: (orderId: number, promotionData?: any) => void;
  onResendCode: () => void;
  onChangeEmail: () => void;
}

export default function EmailVerificationForm({
  email,
  name = "Usuario",
  reelUrl = "https://www.instagram.com/reel/placeholder",
  onVerificationSuccess,
  onResendCode,
  onChangeEmail
}: EmailVerificationFormProps) {
  // Create an array of 6 digits for verification code
  const [verificationDigits, setVerificationDigits] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showDirectProcessOption, setShowDirectProcessOption] = useState(false);
  const [directProcessLoading, setDirectProcessLoading] = useState(false);
  
  // Create refs for each input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Show direct process option after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDirectProcessOption(true);
    }, 30000); // 30 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Handle change for each digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update the digit at the current index
    const newDigits = [...verificationDigits];
    newDigits[index] = value;
    setVerificationDigits(newDigits);
    setError(null);
    
    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down for backspace to go to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste to distribute digits across inputs
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Only process if it looks like a verification code
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split('');
      const newDigits = [...verificationDigits];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newDigits[index] = digit;
        }
      });
      
      setVerificationDigits(newDigits);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newDigits.findIndex(d => !d);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Combine digits into a single code
    const verificationCode = verificationDigits.join('');
    
    // Track verification attempt
    if (typeof window !== "undefined" && window.trackGA) {
      window.trackGA("reel_trial_verification_attempt", "verification_interaction");
    }
    
    if (verificationCode.length !== 6) {
      setError("Por favor, introduce el código de 6 dígitos completo");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/reel-trial/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Track successful verification
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_verification_success", "verification_success");
        }
        
        // Call the success callback with the order ID and promotion data
        onVerificationSuccess(data.orderId, data.promotion);
      } else {
        setError(data.message || "Error al verificar el código. Por favor, inténtalo de nuevo.");
        
        // Track failed verification
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_verification_error", "verification_error");
        }
      }
    } catch (error) {
      setError("Error de conexión. Por favor, inténtalo de nuevo.");
      
      // Track error
      if (typeof window !== "undefined" && window.trackGA) {
        window.trackGA("reel_trial_verification_connection_error", "verification_error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    // Track resend code attempt
    if (typeof window !== "undefined" && window.trackGA) {
      window.trackGA("reel_trial_resend_code", "verification_interaction");
    }
    
    setResendDisabled(true);
    setResendCountdown(60);
    
    // Call the resend callback
    onResendCode();
    
    // Start countdown timer
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle direct process fallback option
  const handleDirectProcess = async () => {
    // Track direct process attempt
    if (typeof window !== "undefined" && window.trackGA) {
      window.trackGA("reel_trial_direct_process", "verification_bypass");
    }
    
    setDirectProcessLoading(true);
    
    try {
      // Call the direct-process API instead
      const response = await fetch("/api/reel-trial/direct-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "my-secret-api-key", // This should match the API_KEY in the route
        },
        body: JSON.stringify({
          email,
          name,
          reelUrl,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Track successful direct process
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_direct_process_success", "verification_bypass_success");
        }
        
        // Call the success callback with the order ID and promotion data
        onVerificationSuccess(data.data?.orderId, data.promotion);
      } else if (response.status === 409) {
        // Handle duplicate error
        setError("Ya has utilizado tu prueba gratuita.");
      } else {
        setError(data.message || data.error || "Error al procesar la solicitud. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      setError("Error de conexión. Por favor, inténtalo de nuevo.");
    } finally {
      setDirectProcessLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] bg-opacity-10 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF0169]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Verifica tu email
        </h3>
        <p className="text-gray-500">
          Hemos enviado un código de verificación a <span className="font-medium text-gray-700">{email}</span>
        </p>
        
        {/* Email check notice */}
        <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p>
            <strong>¿No recibes el email?</strong> Revisa tu carpeta de spam o correo no deseado. 
            El email puede tardar unos minutos en llegar.
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-3">
            Código de verificación
          </label>
          
          <div className="flex justify-between gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="w-full">
                <input
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={verificationDigits[index]}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-full aspect-square text-center text-xl font-semibold rounded-xl border ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#FF0169] focus:border-transparent transition-all duration-200`}
                />
              </div>
            ))}
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] text-white px-6 py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Verificar y recibir visualizaciones
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendDisabled}
          className={`flex items-center gap-1.5 text-[#FF0169] hover:text-[#D300C5] ${
            resendDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          {resendDisabled 
            ? `Reenviar código (${resendCountdown}s)` 
            : "Reenviar código"}
        </button>
        
        <span className="hidden sm:inline text-gray-400">|</span>
        
        <button
          type="button"
          onClick={onChangeEmail}
          className="flex items-center gap-1.5 text-[#FF0169] hover:text-[#D300C5]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Cambiar email
        </button>
      </div>
      
      {/* Direct process fallback option */}
      {showDirectProcessOption && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              ¿Problemas para recibir el código?
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Si tienes problemas para recibir el código de verificación, puedes intentar el proceso directo.
            </p>
            <button
              type="button"
              onClick={handleDirectProcess}
              disabled={directProcessLoading}
              className="text-sm flex items-center justify-center mx-auto gap-1.5 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {directProcessLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                  Continuar sin verificación
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 