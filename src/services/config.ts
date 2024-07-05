import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
export const BASE_URL = ""
const TIME_OUT = 30000
export const DO_THIS_USER_TOKEN = "do_this_user_token"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIME_OUT
})

export const saveToken = async (key:string, value:string) =>{
    try {
        await SecureStore.setItemAsync(key,value)
    } catch (error) {
        console.log('error in saveToken',error)
        throw error
    }
}

axiosInstance.interceptors.request.use(async (req) => {
    try {
        const access_token = await SecureStore.getItemAsync(DO_THIS_USER_TOKEN)
        req.headers.Authorization = access_token
        return req
    } catch (error) {
        return req
    }
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const errorMessage = error.response?.data?.message || error.message;
      return Promise.reject(new Error(errorMessage));
    }
);

export const fetcher = (url: string) =>
    axiosInstance.get(url).then((res)=>res.data)

export default axiosInstance