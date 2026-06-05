import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function DynamicSEO() {
  const location = useLocation();
  const [seoData, setSeoData] = useState(null);
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/meta-tags/current?route=${encodeURIComponent(location.pathname)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setSeoData(json.data);
        } else {
          setSeoData(null);
        }
      } catch (err) {
        console.error("Error fetching meta tags:", err);
      }
    };
    
    fetchMetaTags();
  }, [location.pathname]);

  if (!seoData) return null;

  return (
    <Helmet>
      {seoData.meta_title && <title>{seoData.meta_title}</title>}
      {seoData.meta_description && <meta name="description" content={seoData.meta_description} />}
      {seoData.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
    </Helmet>
  );
}
