// Set SITE_URL to the final HTTPS origin at launch. Preview hosts stay out of search.
function publicOrigin(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname === "localhost" || !url.hostname.includes(".") || url.hostname.endsWith(".test") || url.hostname.endsWith(".example")) return undefined;
    return url.origin;
  } catch { return undefined; }
}
export const siteUrl = publicOrigin(process.env.VERCEL_ENV === "preview" ? undefined : process.env.SITE_URL);
export const business = {
  name: "ProSurface Performance Courts",
  telephone: "+19037327124",
  title: "Court Construction & Resurfacing in DFW | ProSurface",
  description: "Custom basketball, pickleball and tennis courts in Dallas–Fort Worth. Court construction, resurfacing, epoxy coatings and concrete finishes. Call ProSurface.",
  area: { "@type": "Place", name: "Dallas–Fort Worth, Texas" },
};
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl ?? ""}/#organization`,
      name: business.name,
      description: business.description,
      telephone: business.telephone,
      areaServed: business.area,
      ...(siteUrl ? { url: siteUrl, logo: `${siteUrl}/images/logo-transparent.png` } : {}),
      contactPoint: { "@type": "ContactPoint", telephone: business.telephone, contactType: "Project inquiries", areaServed: business.area, availableLanguage: "English" },
      hasOfferCatalog: {
        "@type": "OfferCatalog", name: "Courts and specialty surfaces",
        itemListElement: ["Athletic court construction", "Court resurfacing", "Specialty epoxy coatings", "Stained and sealed concrete"].map(name => ({
          "@type": "Offer", itemOffered: { "@type": "Service", name, areaServed: business.area, provider: { "@id": `${siteUrl ?? ""}/#organization` } },
        })),
      },
    },
    ...(siteUrl ? [{ "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: business.name, inLanguage: "en-US", publisher: { "@id": `${siteUrl}/#organization` } }] : []),
  ],
};
