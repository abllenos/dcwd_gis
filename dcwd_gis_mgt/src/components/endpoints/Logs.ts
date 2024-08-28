import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-gis.davao-water.gov.ph/helpers/gis/api/UserLogs',
});

export const fetchLogs = async (layerID: string) => {
  const endpoint = `/getLogs.php?layerID=${layerID}`; 
  console.log('Fetching logs from:', api.defaults.baseURL + endpoint);

  try {
    const response = await api.get(endpoint);

    if (response.data && response.data.success) {
      return response.data; 
    } else {
      return { success: false, message: 'Data Not Found' };
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    return {
      success: false,
      message: 'An error occurred while requesting to API. Please try again.',
    };
  }
};
