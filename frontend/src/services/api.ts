import axios from "axios";
import type { ApiResponse } from "../types";

const API_BASE_URL=import.meta.env.VITE_API_URL

export const processAdharOCR=async(frontImage:File,backImage?:File):Promise<ApiResponse>=>{
    const formData=new FormData();
    formData.append('frontImage',frontImage)
    if (backImage) {
    formData.append('backImage', backImage);
  }

  try {

    const response=await axios.post(`${API_BASE_URL}/api/ocr/process`,formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        },
    });
    return response.data;
    
  } catch (error) {
     if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}