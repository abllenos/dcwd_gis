import axios from 'axios';


const API_URL = 'https://gis.davao-water.gov.ph/web/dcwdgismgt/home/ajax/query/getDepartment.php';

export const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};