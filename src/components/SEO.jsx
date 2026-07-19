import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url, schemaMarkup }) {
  const defaultTitle = "Arihant | Premium Quality Flours, Grains, and Spices";
  const defaultDescription = "Experience the finest quality flours, pulses, and spices. Arihant delivers farm-fresh, premium agricultural products for retail and B2B distributors.";
  const defaultImage = "https://admin.arihant.in/logo.png"; // Fallback image
  const siteUrl = "https://admin.arihant.in"; // Fallback domain

  const seoTitle = title ? `${title} | Arihant` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />

      {/* Schema.org JSON-LD Structured Data */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
}
