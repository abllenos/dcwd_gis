// Direct API testing utility for license endpoint
// Use this in browser console to test the API connection

export const testDirectLicenseAPI = async () => {
  
  // Test different endpoint variations
  const endpoints = [
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/getRegUsers.php?mode=active',
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query/getRegUsers.php?mode=active', 
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/getRegUsers.php',
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query/getRegUsers.php',
  ];

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });
      
      const text = await response.text();
      
      // Try to parse as JSON
      try {
        JSON.parse(text);
      } catch (parseError) {
        // Silent failure
      }
      
    } catch (error) {
      // Silent failure
    }
  }

  // Test the proxied endpoint through Vite
  try {
    await fetch('/api/license/getRegUsers.php?mode=active');
  } catch (error) {
    // Silent failure
  }
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).testDirectLicenseAPI = testDirectLicenseAPI;
}