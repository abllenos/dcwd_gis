import axios from 'axios';


const API_URL = 'http://192.100.140.198/helpers/gis/mgtsys/getLayers/getDmaInlet.php';

export const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('Raw API Response:', response);

      if (response.status === 200) {
      
        let data = response.data;

        
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          data = data.results || data.data || [];
        }

        console.log('Processed Data:', data); 
        return Array.isArray(data) ? data : [];
      } else {
        throw new Error(`Server responded with status code ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
};
