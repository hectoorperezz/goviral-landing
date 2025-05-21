'use client';

import { useState } from 'react';

interface PlanConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  planType: 'starter' | 'influencer' | 'enterprise';
}

export default function PlanConfiguratorModal({
  isOpen,
  onClose,
  planId,
  planName,
  planType
}: PlanConfiguratorModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Configurar Plan {planName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Configura las opciones para tu plan {planName}
          </p>
          
          <div className="space-y-4">
            {/* Plan configuration options would go here */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">ID del Plan: {planId}</p>
              <p className="text-sm text-gray-500">Tipo: {planType}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white"
            style={{ 
              backgroundImage: 'linear-gradient(to right, rgb(214,77,173), rgb(244,102,110))' 
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
} 