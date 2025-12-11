import React, { useState, useEffect } from 'react';

export const LazyImage = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state when the image source changes (e.g. reused in modals)
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoaded(true); // Stop skeleton if no source
    } else {
      setHasError(false);
      setIsLoaded(false); // Start loading
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      
      {/* Image with Native Lazy Loading */}
      {src && !hasError && (
        <img
          src={src}
          alt={alt || 'Image'}
          loading="lazy" 
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && src && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}

      {/* Error / No Image Placeholder */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4 border border-slate-100">
          <svg 
            className="w-8 h-8 opacity-40 mb-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">No Image</span>
        </div>
      )}
    </div>
  );
};