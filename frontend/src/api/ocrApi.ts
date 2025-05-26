import axios from "axios";

const API_URL=import.meta.env.VITE_BACKEND_URL;

export const sendImagesForOCR=async(formData:FormData)=>{
    const response=await axios.post(API_URL,formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        },
    })
    return response.data
}