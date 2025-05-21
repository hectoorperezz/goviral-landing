'use client';

import { useState, useEffect } from 'react';
import { createCheckout } from '@/lib/shopify';
import { motion } from 'framer-motion';

interface PlanConfiguratorProps {
  planId: string;
  planName: string;
  planType: 'starter' | 'influencer' | 'enterprise';
  buttonText?: string;
}

interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
}

export default function PlanConfigurator({
  planId,
  planName,
  planType,
  buttonText = 'Empezar Ahora'
}: PlanConfiguratorProps) {
  // Estado para los tipos seleccionados
  const [seguidoresType, setSeguidoresType] = useState<'internacionales' | 'espanoles'>('internacionales');
  const [likesType, setLikesType] = useState<'internacionales' | 'espanoles'>('internacionales');
  
  // Estado para los sliders
  const [sliders, setSliders] = useState<Record<string, SliderConfig>>({
    seguidores: {
      id: 'seguidores',
      label: 'Seguidores al Día',
      min: 0,
      max: 50,
      step: 1,
      value: 50,
      unit: ''
    },
    likes: {
      id: 'likes',
      label: 'Likes por Publicación',
      min: 0,
      max: 1000,
      step: 10,
      value: 500,
      unit: ''
    },
    views: {
      id: 'views',
      label: 'Views por Reel',
      min: 0,
      max: 4000,
      step: 50,
      value: 2000,
      unit: ''
    },
    impresiones: {
      id: 'impresiones',
      label: 'Impresiones por Publicación',
      min: 0,
      max: 2000,
      step: 50,
      value: 1000,
      unit: ''
    }
  });

  // Estado para el loading y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [globalPoints, setGlobalPoints] = useState(0);
  const [globalPointsLimit, setGlobalPointsLimit] = useState(4000);

  // Configurar límites y valores según el tipo de plan
  useEffect(() => {
    let newSliders = { ...sliders };
    let pointsLimit = 4000;

    if (planType === 'starter') {
      newSliders.seguidores.max = seguidoresType === 'espanoles' ? 15 : 50;
      newSliders.seguidores.value = seguidoresType === 'espanoles' ? 15 : 50;
      
      newSliders.likes.max = likesType === 'espanoles' ? 200 : 1000;
      newSliders.likes.value = likesType === 'espanoles' ? 100 : 500;
      
      newSliders.views.max = 4000;
      newSliders.views.value = 2000;
      
      newSliders.impresiones.max = 2000;
      newSliders.impresiones.value = 1000;
      
      pointsLimit = 4000;
    } else if (planType === 'influencer') {
      newSliders.seguidores.max = seguidoresType === 'espanoles' ? 50 : 150;
      newSliders.seguidores.value = seguidoresType === 'espanoles' ? 50 : 150;
      
      newSliders.likes.max = likesType === 'espanoles' ? 600 : 3000;
      newSliders.likes.value = likesType === 'espanoles' ? 300 : 1500;
      
      newSliders.views.max = 10000;
      newSliders.views.value = 5000;
      
      newSliders.impresiones.max = 8000;
      newSliders.impresiones.value = 4000;
      
      pointsLimit = 10500;
    } else if (planType === 'enterprise') {
      newSliders.seguidores.max = seguidoresType === 'espanoles' ? 100 : 450;
      newSliders.seguidores.value = seguidoresType === 'espanoles' ? 100 : 450;
      
      newSliders.likes.max = likesType === 'espanoles' ? 1400 : 7000;
      newSliders.likes.value = likesType === 'espanoles' ? 700 : 3500;
      
      newSliders.views.max = 20000;
      newSliders.views.value = 10000;
      
      newSliders.impresiones.max = 16000;
      newSliders.impresiones.value = 8000;
      
      pointsLimit = 21500;
    }

    setSliders(newSliders);
    setGlobalPointsLimit(pointsLimit);
    calculateTotalPoints(newSliders);
  }, [planType, seguidoresType, likesType]);

  // Calcular el total de puntos
  const calculateTotalPoints = (currentSliders = sliders) => {
    const likesMultiplier = likesType === 'espanoles' ? 5 : 1;
    const totalLikesValue = currentSliders.likes.value * likesMultiplier;
    
    const total = currentSliders.views.value + totalLikesValue + currentSliders.impresiones.value;
    setGlobalPoints(total);
    return total;
  };

  // Manejar cambios en los sliders
  const handleSliderChange = (id: string, value: number) => {
    const newSliders = { ...sliders };
    newSliders[id].value = value;
    
    // Verificar si excede el límite global
    const totalPoints = calculateTotalPoints(newSliders);
    if (totalPoints <= globalPointsLimit) {
      setSliders(newSliders);
    }
  };

  // Manejar el checkout
  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      // Crear un objeto con todas las propiedades seleccionadas
      const properties = {
        'Tipo de seguidores': seguidoresType,
        'Cantidad de Seguidores': sliders.seguidores.value,
        'Tipo de likes': likesType,
        'Cantidad de Likes': sliders.likes.value,
        'Cantidad de Views': sliders.views.value,
        'Cantidad de Impresiones': sliders.impresiones.value
      };

      // Crear un item para el carrito con el ID del plan seleccionado
      const cartItems = [
        {
          variantId: planId,
          quantity: 1,
          customAttributes: Object.entries(properties).map(([key, value]) => ({
            key,
            value: String(value)
          }))
        }
      ];

      console.log('Iniciando checkout con:', { planId, planName, properties });
      
      try {
        // Llamar a la API para crear un checkout
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: cartItems }),
        });
        
        console.log('Status de la respuesta:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('Datos JSON recibidos:', data);
        
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status} - ${data.error || data.message || 'Error desconocido'}`);
        }
        
        if (!data.checkoutUrl) {
          throw new Error('No se recibió una URL de checkout válida');
        }
        
        console.log('URL de checkout recibida:', data.checkoutUrl);
        
        // Redirigir al usuario a la página de checkout de Shopify
        window.location.href = data.checkoutUrl;
      } catch (apiError: any) {
        console.error('Error en la llamada a la API:', apiError);
        throw apiError;
      }
    } catch (err: any) {
      console.error('Error al procesar el checkout:', err);
      setError(`Error: ${err.message || 'Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 my-8">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Configura tu Plan {planName}
      </h2>
      
      <div className="space-y-8">
        {/* Sección de Seguidores */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Seguidores</h3>
          
          <div className="mb-4">
            <label htmlFor="tipoSeguidores" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de seguidores:
            </label>
            <select
              id="tipoSeguidores"
              value={seguidoresType}
              onChange={(e) => setSeguidoresType(e.target.value as 'internacionales' | 'espanoles')}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="internacionales">Internacionales</option>
              <option value="espanoles">Españoles</option>
            </select>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="seguidoresSlider" className="block text-sm font-medium text-gray-700">
                {sliders.seguidores.label}:
              </label>
              <span className="text-purple-600 font-semibold">{sliders.seguidores.value}</span>
            </div>
            
            <input
              type="range"
              id="seguidoresSlider"
              min={sliders.seguidores.min}
              max={sliders.seguidores.max}
              step={sliders.seguidores.step}
              value={sliders.seguidores.value}
              onChange={(e) => handleSliderChange('seguidores', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{sliders.seguidores.min}</span>
              <span>{sliders.seguidores.max}</span>
            </div>
          </div>
        </div>
        
        {/* Sección de Likes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Likes</h3>
          
          <div className="mb-4">
            <label htmlFor="tipoLikes" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de likes:
            </label>
            <select
              id="tipoLikes"
              value={likesType}
              onChange={(e) => setLikesType(e.target.value as 'internacionales' | 'espanoles')}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="internacionales">Internacionales</option>
              <option value="espanoles">Españoles</option>
            </select>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="likesSlider" className="block text-sm font-medium text-gray-700">
                {sliders.likes.label}:
              </label>
              <span className="text-purple-600 font-semibold">{sliders.likes.value}</span>
            </div>
            
            <input
              type="range"
              id="likesSlider"
              min={sliders.likes.min}
              max={sliders.likes.max}
              step={sliders.likes.step}
              value={sliders.likes.value}
              onChange={(e) => handleSliderChange('likes', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{sliders.likes.min}</span>
              <span>{sliders.likes.max}</span>
            </div>
          </div>
        </div>
        
        {/* Sección de Views */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Views</h3>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="viewsSlider" className="block text-sm font-medium text-gray-700">
                {sliders.views.label}:
              </label>
              <span className="text-purple-600 font-semibold">{sliders.views.value}</span>
            </div>
            
            <input
              type="range"
              id="viewsSlider"
              min={sliders.views.min}
              max={sliders.views.max}
              step={sliders.views.step}
              value={sliders.views.value}
              onChange={(e) => handleSliderChange('views', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{sliders.views.min}</span>
              <span>{sliders.views.max}</span>
            </div>
          </div>
        </div>
        
        {/* Sección de Impresiones */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Impresiones</h3>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="impresionesSlider" className="block text-sm font-medium text-gray-700">
                {sliders.impresiones.label}:
              </label>
              <span className="text-purple-600 font-semibold">{sliders.impresiones.value}</span>
            </div>
            
            <input
              type="range"
              id="impresionesSlider"
              min={sliders.impresiones.min}
              max={sliders.impresiones.max}
              step={sliders.impresiones.step}
              value={sliders.impresiones.value}
              onChange={(e) => handleSliderChange('impresiones', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{sliders.impresiones.min}</span>
              <span>{sliders.impresiones.max}</span>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso global */}
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Uso total de recursos:</span>
            <span className="text-sm font-medium text-gray-700">{Math.round((globalPoints / globalPointsLimit) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (globalPoints / globalPointsLimit) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{globalPoints} / {globalPointsLimit}</p>
        </div>
        
        {/* Botón de checkout */}
        <motion.button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 px-6 text-white font-medium rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            buttonText
          )}
        </motion.button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
