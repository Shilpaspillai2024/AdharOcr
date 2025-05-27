import React from "react";
import type { AadhaarData } from "../types";

interface ParsedDataProps{
    data:AadhaarData
}

const ParsedData:React.FC<ParsedDataProps>=({data})=>{
   return(
    <div className="parsed-data">
          <h3>Parsed Data</h3>
      <div className="data-grid">
        <div className="data-row">
          <div className="data-field">
            <label>Aadhaar Number</label>
            <div className="data-value">
              {data.aadhaarNumber || 'Not found'}
            </div>
          </div>
          <div className="data-field">
            <label>Name on Aadhaar</label>
            <div className="data-value">
              {data.name || 'Not found'}
            </div>
          </div>
        </div>

        <div className="data-row">
          <div className="data-field">
            <label>Date of birth</label>
            <div className="data-value">
              {data.YearOfBirth || 'Not found'}
            </div>
          </div>
          <div className="data-field">
            <label>Gender</label>
            <div className="data-value">
              {data.gender || 'Not found'}
            </div>
          </div>
        </div>

        <div className="data-row full-width">
          <div className="data-field">
            <label>Address</label>
            <div className="data-value">
              {data.address || 'Not found'}
            </div>
          </div>
        </div>

        <div className="data-row">
          <div className="data-field">
            <label>Pincode</label>
            <div className="data-value">
              {data.pincode || 'Not found'}
            </div>
          </div>
        </div>
      </div>
    </div>
   )
}

export default ParsedData