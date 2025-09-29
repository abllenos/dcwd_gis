// Direct API testing utility for license endpoint
// Use this in browser console to test the API connection

export const testDirectLicenseAPI = async () => {
  console.log('🧪 Testing License API endpoints...');
  
  // Test different endpoint variations
  const endpoints = [
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/getRegUsers.php?mode=active',
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query/getRegUsers.php?mode=active', 
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/getRegUsers.php',
    'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query/getRegUsers.php',
  ];

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    console.log(`\n🔗 Testing endpoint ${i + 1}:`, endpoint);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      console.log(`📝 Raw Response (first 200 chars):`, text.substring(0, 200));
      
      // Try to parse as JSON
      try {
        const json = JSON.parse(text);
        console.log(`🔍 Parsed JSON:`, json);
        console.log(`📊 Data type: ${typeof json}, Array: ${Array.isArray(json)}`);
        if (Array.isArray(json)) {
          console.log(`📈 Array length: ${json.length}`);
          if (json.length > 0) {
            console.log(`🎯 First item:`, json[0]);
          }
        }
      } catch (parseError) {
        console.log(`❌ JSON Parse Error:`, parseError);
        console.log(`📄 Response appears to be text/HTML, not JSON`);
      }
      
    } catch (error) {
      console.log(`❌ Network Error:`, error);
    }
  }

  // Test the proxied endpoint through Vite
  console.log(`\n🔗 Testing proxied endpoint: /api/license/getRegUsers.php?mode=active`);
  try {
    const proxyResponse = await fetch('/api/license/getRegUsers.php?mode=active');
    console.log(`✅ Proxy Status: ${proxyResponse.status} ${proxyResponse.statusText}`);
    const proxyText = await proxyResponse.text();
    console.log(`📝 Proxy Response:`, proxyText.substring(0, 200));
    
    try {
      const proxyJson = JSON.parse(proxyText);
      console.log(`🎯 Proxy JSON:`, proxyJson);
    } catch (e) {
      console.log(`❌ Proxy response not JSON`);
    }
  } catch (error) {
    console.log(`❌ Proxy Error:`, error);
  }
  
  console.log('\n✨ API testing complete!');
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).testDirectLicenseAPI = testDirectLicenseAPI;
}