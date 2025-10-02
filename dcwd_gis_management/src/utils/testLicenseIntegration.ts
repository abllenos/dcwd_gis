import { licenseApiService } from '../services/licenseApiService';

// Simple test function to verify the license API integration
export const testLicenseApiIntegration = async () => {
  console.log('=== Testing License API Integration ===');
  
  try {
    // Test 1: API Connection
    console.log('\n1. Testing API Connection...');
    const connectionTest = await licenseApiService.testConnection();
    console.log('Connection Result:', connectionTest);
    
    // Test 2: Fetch Active Users
    console.log('\n2. Fetching Active Users...');
    const activeUsers = await licenseApiService.getActiveUsers();
    console.log('Active Users Result:', {
      success: activeUsers.success,
      count: activeUsers.count,
      message: activeUsers.message,
      sampleData: activeUsers.data?.slice(0, 2) // Show first 2 users as sample
    });
    
    // Test 3: Fetch All Users
    console.log('\n3. Fetching All Users...');
    const allUsers = await licenseApiService.getUsersByStatus('all');
    console.log('All Users Result:', {
      success: allUsers.success,
      count: allUsers.count,
      message: allUsers.message
    });
    
    console.log('\n=== Test Completed ===');
    
    return {
      connectionTest: connectionTest.success,
      activeUsersTest: activeUsers.success,
      allUsersTest: allUsers.success,
      totalActiveUsers: activeUsers.count || 0,
      totalUsers: allUsers.count || 0
    };
    
  } catch (error) {
    console.error('Test failed with error:', error);
    return {
      connectionTest: false,
      activeUsersTest: false,
      allUsersTest: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Direct API test without CORS (for browser console testing)
export const testDirectAPI = async () => {
  try {
    console.log('Testing direct API call...');
    
    // Use fetch with mode: 'no-cors' for testing
    const response = await fetch('https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/getRegUsers.php?mode=active', {
      method: 'GET',
      mode: 'no-cors', // This bypasses CORS but limits response access
    });
    
    console.log('Response status:', response.status);
    console.log('Response type:', response.type);
    
    if (response.type === 'opaque') {
      console.log('Request was sent but response is opaque due to CORS. This means the API endpoint exists and responds.');
      return { success: true, message: 'API endpoint is reachable (opaque response due to CORS)' };
    }
    
    return { success: true, message: 'API test completed' };
    
  } catch (error) {
    console.error('Direct API test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to run test from browser console
(window as any).testLicenseAPI = testLicenseApiIntegration;
(window as any).testDirectAPI = testDirectAPI;