import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";
export default function robots(): MetadataRoute.Robots {
  // Allow fetching the preview so search engines can see its explicit noindex meta tag.
  return { rules: { userAgent: "*", allow: "/" }, ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}) };
}
