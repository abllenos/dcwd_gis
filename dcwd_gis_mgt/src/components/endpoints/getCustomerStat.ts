import axios from 'axios';


const api = axios.create({
  baseURL: 'https://api-gis.davao-water.gov.ph/helpers/gis/', 
});


export const getCustomerStat = async () => {
  try {
    
    const response = await api.get('/mgtsys/statistics/getCustomer.php'); 
    console.log('API Response:', response.data); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching Customer Statistics', error); 
    throw error; 
  }
};
