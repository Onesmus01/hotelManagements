// validateToken.ts
import axios from 'axios';

const validateToken = async ()=> {
  try {
    const response = await axios.get('http://localhost:7000/api/user/validate-token', {
      withCredentials: true, 
    });

    if (response.status === 200 && response.data.userId) {
      return { valid: true, userId: response.data.userId };
    }

    return { valid: false };
  } catch (error) {
    console.error('Error validating token:', error);
    return { valid: false };
  }
};

export default validateToken;
