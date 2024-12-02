import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
    baseURL: 'https://liftlog-backend.up.railway.app',
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
});

export default apiClient;