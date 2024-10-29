import axios from 'axios';

const apiUserLogs = axios.create({
  baseURL: 'https://api-gis.davao-water.gov.ph/helpers/gis/api/UserLogs',
});

// const apiGeometry = axios.create({
//   baseURL: 'https://api-gis.davao-water.gov.ph/helpers/gis/api/UserLogs',
// });

export const fetchLogs = async (layerID: string) => {
  const endpoint = `/getLogs.php?layerID=${layerID}`; 
  console.log('Fetching logs from:', apiUserLogs.defaults.baseURL + endpoint);

  try {
    const response = await apiUserLogs.get(endpoint);

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

export const fetchGeometry = async (LogID: string, LayerID: number, AssetID: string) => {
  const cleanedLayerID = LayerID.toString().trim().replace(/\s+/g, ' ');
  const endpoint = `/getLogsGeometry.php?LogID=${LogID}&LayerID=${encodeURIComponent(cleanedLayerID)}&AssetID=${AssetID}`;
  console.log('Fetching geometry from:', apiUserLogs.defaults.baseURL + endpoint);

  try {
    const response = await apiUserLogs.get(endpoint);
    console.log('Full response:', response);
    console.log('Response data:', response.data);  

   
    const geojsonString = response.data?.data?.st_asgeojson || response.data?.st_asgeojson;

    if (geojsonString) {
      try {
        const parsedGeoJson = JSON.parse(geojsonString);
        if (parsedGeoJson && parsedGeoJson.coordinates) {
          return { success: true, coordinates: parsedGeoJson.coordinates };
        } else {
          return { success: false, message: 'Coordinates data not found.' };
        }
      } catch (parseError) {
        console.error('GeoJSON parsing error:', parseError);
        return { success: false, message: 'Failed to parse GeoJSON data.' };
      }
    } else {
      console.error('st_asgeojson not found in the response data.');
      return { success: false, message: 'st_asgeojson not found in the response.' };
    }
  } catch (error) {
    console.error('Error fetching Geometry:', error);
    return { success: false, message: 'An error occurred while requesting to API. Please try again.' };
  }
};
