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
    <div className="api-response">
      <h3>API Response</h3>
      <div className={`response-container ${response.status ? 'success' : 'error'}`}>
        <pre className="json-response">
          {formatJsonResponse()}
        </pre>
      </div>
      </div>
)
}
export default ApiResponseData