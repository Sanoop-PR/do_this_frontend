import { IUser } from "@/types/Index";
import axiosInstance, { DO_THIS_USER_TOKEN, saveToken } from "./config";

type RegisterUserTypes = IUser

export const registerUser = async({
    name,email,password
}: RegisterUserTypes) =>{
    try {
        const response = await axiosInstance.post("/users/create",{
           name,email,password 
        })
        return response.data.user
    } catch (error) {
        console.log('error in registerUser',error)
        throw error
    }
}

type LoginUserTypes = Omit<IUser,"name">

export const loginUser = async({email,password}:LoginUserTypes) =>{
    try {
        const response = await axiosInstance.post("/users/login",{
            email,password
        })
        const token = response.data.token
        axiosInstance.defaults.headers.common["Authorization"] = token
        saveToken(DO_THIS_USER_TOKEN,token)
        return response.data.user
    } catch (error) {
        console.log('error in login user' , error)
        throw error
    }
}