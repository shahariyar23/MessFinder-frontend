// hooks/useRouteMetadata.js
import { useEffect } from 'react';
import { useMatches, useLocation } from 'react-router';

export function useRouteMetadata() {
  const matches = useMatches();
  const location = useLocation();
  
  useEffect(() => {
    const routeHandle = matches[matches.length - 1]?.handle || {};
    const { title = "Mess Finder", meta = {} } = routeHandle;
    
    // Update document title immediately
    document.title = title;
    
    // Update or create meta tags
    updateMetaTag('description', meta.description || 'Find the best mess services near you');
    updateMetaTag('keywords', meta.keywords || 'mess, food, meal, booking');
    
    // Update OG tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', meta.description || 'Find the best mess services near you', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    
  }, [matches, location.pathname]); // Add location.pathname as dependency
}

function updateMetaTag(name, content, attribute = 'name') {
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
}