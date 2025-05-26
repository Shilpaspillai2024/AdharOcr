import React, { useState } from "react";
import { sendImagesForOCR } from "../api/ocrApi";

const OcrUploader=()=>{
    const[front,setFront]=useState<File|null>(null)
    const[back,setBack]=useState<File|null>(null)
    const[result,setResult]=useState<string|null>(null)
    const[loading,setLoading]=useState(false)

    const handleSubmit=async(e:React.FormEvent)=>{
       
        e.preventDefault();
        if(!front || !back) return alert('upload both images')
    
        
            const formData=new FormData()
            formData.append('front',front)
            formData.append('back',back)

            setLoading(true)

            try {
                const data=await sendImagesForOCR(formData)
                setResult(data.text)
                
            } catch (error) {
                console.error(error)
                alert('OCR failed')
            } finally{
                setLoading(false)
            }
    
    
        }

    return(
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
         <input type="file" accept="image/*" onChange={e=>setFront(e.target.files?.[0] || null)}/>
         <input type="file" accept="image/*" onChange={e=>setBack(e.target.files?.[0] || null)}/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Process OCR</button>
        {loading && <p>Processing...</p>}

        {result &&(
             <div className="bg-gray-100 p-4 mt-4">
          <h3 className="font-bold">OCR Result:</h3>
          <pre>{result}</pre>
        </div>
        )}
       </form>
    )
}

export default OcrUploader;