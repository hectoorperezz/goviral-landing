"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import EmailVerificationForm from "./EmailVerificationForm";

// Extend Window interface to include trackGA function
declare global {
  interface Window {
    trackGA?: (action: string, label: string) => void;
    sendGAdsConversion?: (sendTo: string, value?: number) => void;
  }
}

interface FormData {
  name: string;
  email: string;
  reelUrl: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  reelUrl?: string;
}

type FormStep = "form" | "verification" | "success";

export default function InstagramReelTrial() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    reelUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor, introduce un email válido";
    }
    
    // Validate Instagram reel URL
    const instagramUrlRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/;
    if (!formData.reelUrl.trim()) {
      newErrors.reelUrl = "La URL del reel es obligatoria";
    } else if (!instagramUrlRegex.test(formData.reelUrl)) {
      newErrors.reelUrl = "Por favor, introduce una URL válida de Instagram reel";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Track form submission attempt
    if (typeof window !== "undefined" && window.trackGA) {
      window.trackGA("reel_trial_form_submit", "form_interaction");
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const response = await fetch("/api/reel-trial/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Move to verification step
        setCurrentStep("verification");
        setPreviewUrl(data.previewUrl);
        
        // Track successful submission
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_request_success", "form_success");
        }
      } else if (response.status === 409) {
        // Handle duplicate trial
        setSubmitStatus("duplicate");
        setStatusMessage(data.message || "Ya has utilizado tu prueba gratuita.");
        
        // Track duplicate submission
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_duplicate", "form_duplicate");
        }
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.message || "Ha ocurrido un error. Por favor, inténtalo de nuevo.");
        
        // Track failed submission
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_error", "form_error");
        }
      }
    } catch (error) {
      setSubmitStatus("error");
      setStatusMessage("Ha ocurrido un error de conexión. Por favor, inténtalo de nuevo.");
      
      // Track error
      if (typeof window !== "undefined" && window.trackGA) {
        window.trackGA("reel_trial_connection_error", "form_error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSuccess = (newOrderId: number) => {
    setOrderId(newOrderId);
    setCurrentStep("success");
    
    // Track successful trial with GA4
    if (typeof window !== "undefined" && window.trackGA) {
      window.trackGA("reel_trial_complete", "trial_success");
    }
    
    // Track conversion with Google Ads
    if (typeof window !== "undefined" && window.sendGAdsConversion) {
      window.sendGAdsConversion("AW-16805560957/reel_trial_complete", 0);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch("/api/reel-trial/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPreviewUrl(data.previewUrl);
        
        // Track resend success
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_resend_success", "verification_interaction");
        }
      } else {
        // Track resend error
        if (typeof window !== "undefined" && window.trackGA) {
          window.trackGA("reel_trial_resend_error", "verification_error");
        }
      }
    } catch (error) {
      // Track resend connection error
      if (typeof window !== "undefined" && window.trackGA) {
        window.trackGA("reel_trial_resend_connection_error", "verification_error");
      }
    }
  };

  const handleChangeEmail = () => {
    setCurrentStep("form");
  };

  const renderFormStep = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#FF0169] focus:border-transparent transition-all duration-200`}
              placeholder="Tu nombre"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#FF0169] focus:border-transparent transition-all duration-200`}
              placeholder="tu@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="reelUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL del Reel de Instagram
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <input
              type="url"
              id="reelUrl"
              name="reelUrl"
              value={formData.reelUrl}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.reelUrl ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#FF0169] focus:border-transparent transition-all duration-200`}
              placeholder="https://www.instagram.com/reel/..."
            />
          </div>
          {errors.reelUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.reelUrl}</p>
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
                Enviando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Recibir 500 visualizaciones gratis
              </>
            )}
          </button>
        </div>
        
        {submitStatus === "error" && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-700 text-center">{statusMessage}</p>
          </div>
        )}
        
        {submitStatus === "duplicate" && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-700 text-center">{statusMessage}</p>
            <p className="text-amber-700 text-center text-sm mt-2">
              Si necesitas más visualizaciones, considera adquirir uno de nuestros planes.
            </p>
          </div>
        )}
      </form>
    );
  };

  const renderVerificationStep = () => {
    return (
      <>
        <EmailVerificationForm
          email={formData.email}
          onVerificationSuccess={handleVerificationSuccess}
          onResendCode={handleResendCode}
          onChangeEmail={handleChangeEmail}
        />
      </>
    );
  };

  const renderSuccessStep = () => {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Verificación completada!
        </h3>
        
        <div className="bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] p-px rounded-xl mb-6">
          <div className="bg-white p-4 rounded-xl">
            <p className="text-gray-700">
              Tu prueba de <span className="font-semibold">500 visualizaciones</span> ha sido enviada a tu reel de Instagram.
            </p>
            {orderId && (
              <div className="mt-3 py-2 px-4 bg-gray-50 rounded-lg inline-block">
                <span className="text-sm text-gray-500">
                  ID de orden: <span className="font-medium text-gray-700">{orderId}</span>
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => {
              setCurrentStep("form");
              setSubmitStatus("idle");
              setFormData({
                name: "",
                email: "",
                reelUrl: "",
              });
            }}
            className="flex items-center justify-center gap-2 text-[#FF0169] hover:text-[#D300C5] font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Volver al inicio
          </button>
          
          <a 
            href="https://goviral.es/collections/instagram" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#FF0169] font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Ver más servicios
          </a>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative">
      {/* Instagram-inspired decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          {/* Content Column */}
          <div className="lg:w-5/12 mb-10 lg:mb-0">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-block px-3 py-1 bg-[#f2f2f7] text-[#FF0169] font-medium text-xs tracking-wide rounded-full">
                  Prueba Gratuita
                </span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                Impulsa tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5]">Reel de Instagram</span> con 500 visualizaciones gratis
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF0169]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">500 visualizaciones reales para tu reel</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF0169]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Entrega rápida y garantizada</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF0169]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Sin riesgo para tu cuenta</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>Valorado 4.8/5 por más de 6.000 usuarios</span>
              </div>
            </div>
          </div>
          
          {/* Form Column */}
          <div className="lg:w-7/12 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="max-w-md mx-auto">
              {currentStep === "form" && renderFormStep()}
              {currentStep === "verification" && renderVerificationStep()}
              {currentStep === "success" && renderSuccessStep()}
              
              <p className="mt-6 text-xs text-gray-500 text-center">
                Al enviar este formulario, aceptas recibir comunicaciones de GoViral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 