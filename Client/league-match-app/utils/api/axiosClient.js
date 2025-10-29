import axios from 'axios';

const axiosClient = axios.create({
    baseURL : process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:5001/league-match-app/us-central1',
    headers : {
        'Content-Type':'application/json',
    }
});

export default axiosClient;