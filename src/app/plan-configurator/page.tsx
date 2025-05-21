'use client';

import { useState } from 'react';
import PlanConfigurator from '@/components/PlanConfigurator';

export default function PlanConfiguratorPage() {
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    type: 'starter' | 'influencer' | 'enterprise';
    description: string;
    price: string;
  } | null>(null);

  // Datos de ejemplo para los planes
  const plans = [
    {
      id: 'gid://shopify/Product/8463123513687', // Reemplazar con el ID real del producto
      name: 'Starter',
      type: 'starter' as const,
      description: 'Ideal para comenzar a crecer en Instagram',
      price: '29,99€/mes'
    },
    {
      id: 'gid://shopify/Product/8463123546455', // Reemplazar con el ID real del producto
      name: 'Influencer',
      type: 'influencer' as const,
      description: 'Para creadores de contenido que buscan aumentar su alcance',
      price: '59,99€/mes'
    },
    {
      id: 'gid://shopify/Product/8463123579223', // Reemplazar con el ID real del producto
      name: 'Enterprise',
      type: 'enterprise' as const,
      description: 'Solución completa para marcas y empresas',
      price: '99,99€/mes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Planes de <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">GoViral</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Selecciona y personaliza el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        {!selectedPlan ? (
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
                  <p className="mt-4 text-gray-500">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  </p>
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="mt-8 block w-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-md py-3 text-white font-medium hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    Configurar Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <button
              onClick={() => setSelectedPlan(null)}
              className="mb-6 inline-flex items-center text-purple-600 hover:text-purple-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Volver a los planes
            </button>
            
            <PlanConfigurator
              planId={selectedPlan.id}
              planName={selectedPlan.name}
              planType={selectedPlan.type}
              buttonText={`Contratar Plan ${selectedPlan.name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
