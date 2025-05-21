'use client';

import { useState } from 'react';
import PlanConfiguratorModal from './PlanConfiguratorModal';

interface ShopifyCheckoutProps {
  planId: string;
  planName: string;
  planPrice: string;
  buttonText?: string;
}

export default function ShopifyCheckout({ 
  planId, 
  planName, 
  planPrice, 
  buttonText = 'Empezar Ahora' 
}: ShopifyCheckoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Determinar el tipo de plan basado en el nombre
  const getPlanType = () => {
    if (planName.toLowerCase().includes('starter')) return 'starter';
    if (planName.toLowerCase().includes('influencer')) return 'influencer';
    if (planName.toLowerCase().includes('enterprise')) return 'enterprise';
    return 'starter'; // Por defecto
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-full rounded-full py-3 text-center text-[#f8fafc] font-medium transition-all hover:shadow-md"
        style={{ 
          backgroundImage: 'var(--goviral-gradient)'
        }}
      >
        {buttonText}
      </button>
      
      <PlanConfiguratorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planId={`gid://shopify/Product/${planId}`}
        planName={planName}
        planType={getPlanType() as 'starter' | 'influencer' | 'enterprise'}
      />
    </div>
  );
}
