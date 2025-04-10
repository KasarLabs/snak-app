"use client";
import { useState, useEffect } from 'react';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler un chargement de 3 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-980">
      <div className="relative flex flex-col items-center">
        {/* Logo avec animation */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Cercle de chargement externe */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
          
          {/* Cercle de chargement animé */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-100 animate-spin"></div>
          
          {/* Logo central */}
          <div className="z-10 w-28 h-28 bg-black rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/SN-logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
              style={{ filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))' }}
            />
          </div>
        </div>
        
        {/* Texte en dessous */}
        <div className="mt-6 text-gray-300 text-sm font-light">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;