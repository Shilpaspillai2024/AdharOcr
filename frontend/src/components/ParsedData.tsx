import React from "react";
import type { AadhaarData } from "../types";

interface ParsedDataProps{
    data:AadhaarData
}

const ParsedData:React.FC<ParsedDataProps>=({data})=>{
   return(
    <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
  <h3 className="text-xl font-semibold mb-4">Parsed Data</h3>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block font-medium text-gray-700">Aadhaar Number</label>
      <div className="mt-1 text-gray-900">{data.aadhaarNumber || 'Not found'}</div>
    </div>
    <div>
      <label className="block font-medium text-gray-700">Name on Aadhaar</label>
      <div className="mt-1 text-gray-900">{data.name || 'Not found'}</div>
    </div>
    <div>
      <label className="block font-medium text-gray-700">Date of birth</label>
      <div className="mt-1 text-gray-900">{data.YearOfBirth || 'Not found'}</div>
    </div>
    <div>
      <label className="block font-medium text-gray-700">Gender</label>
      <div className="mt-1 text-gray-900">{data.gender || 'Not found'}</div>
    </div>
    <div className="col-span-2">
      <label className="block font-medium text-gray-700">Address</label>
      <div className="mt-1 text-gray-900">{data.address || 'Not found'}</div>
    </div>
    <div>
      <label className="block font-medium text-gray-700">Pincode</label>
      <div className="mt-1 text-gray-900">{data.pincode || 'Not found'}</div>
    </div>
  </div>
</div>

   )
}

export default ParsedData