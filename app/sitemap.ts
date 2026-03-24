import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_SITE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Static routes
  const staticRoutes = [
    '',
    '/franchises',
    '/investors',
    '/exhibitions',
    '/register',
    '/login',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Franchises)
  let franchiseRoutes: any[] = [];
  try {
    const res = await fetch(`${apiUrl}/api/exhibitor-registrations/`);
    if (res.ok) {
      const data = await res.json();
      const results = data.results || data;
      franchiseRoutes = (Array.isArray(results) ? results : []).map((item: any) => ({
        url: `${baseUrl}/franchises/${item.id}`,
        lastModified: new Date(item.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error('Sitemap error (franchises):', e);
  }

  // Dynamic routes (Investors)
  let investorRoutes: any[] = [];
  try {
    const resArr = await fetch(`${apiUrl}/api/investor-registrations/`);
    if (resArr.ok) {
      const data = await resArr.json();
      const results = data.results || data;
      investorRoutes = (Array.isArray(results) ? results : []).map((item: any) => ({
        url: `${baseUrl}/investors/${item.id}`,
        lastModified: new Date(item.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error('Sitemap error (investors):', e);
  }

  return [...staticRoutes, ...franchiseRoutes, ...investorRoutes];
}
