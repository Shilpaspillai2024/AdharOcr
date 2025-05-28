import React from "react";
import type{ ApiResponse } from "../types";

interface ApiResponseProps{
    response:ApiResponse
}

const ApiResponseData:React.FC<ApiResponseProps>=({response})=>{
    const formatJsonResponse = () => {
    const formattedData = {
      status: response.status,
      data: response.data ? {
        Name: response.data.name || "XXXXXXXXXX",
        DOB: response.data.YearOfBirth || null,
        Gender: response.data.gender || undefined,
        UID: response.data.uid || "XXXXXXXXXXXX",
        address: response.data.address || "XXXXXXXXXXXXXXXXX ",
        pincode: response.data.pincode || null,
        
       
      } : null,
      message: response.message || "Parsing Successful"
    };
    console.log("formattedData",formattedData)
    return JSON.stringify(formattedData,null,2)
}
return(
   <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
  <h3 className="text-xl font-semibold mb-4">API Response</h3>
  <div className={`rounded p-4 whitespace-pre-wrap overflow-auto text-sm font-mono ${response.status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
    {formatJsonResponse()}
  </div>
</div>

)
}
export default ApiResponseData