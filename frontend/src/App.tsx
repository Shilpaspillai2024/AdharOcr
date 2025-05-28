import React, { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import ParsedData from './components/ParsedData'
import ApiResponseData from './components/ApiResponseData'
import type{ AadhaarData,ApiResponse as ApiResponseType } from './types'
import { processAdharOCR } from './services/api'
import './App.css'

const App:React.FC=()=>{

  const[frontImage,setFrontImage]=useState<File|null>(null)
  const[backImage,setBackImage]=useState<File|null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<AadhaarData | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponseType | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFrontImageSelect=(file:File)=>{
    setFrontImage(file)
    const preview=URL.createObjectURL(file)
    setFrontPreview(preview)
  }

  const handleBackImageSelect = (file: File) => {
    setBackImage(file);
    const preview = URL.createObjectURL(file);
    setBackPreview(preview);
  };

  const handleParseAadhaar = async () => {
    if (!frontImage) {
      alert('Please upload front image of Aadhaar card');
      return;
    }

    setIsProcessing(true);
    setShowResults(false);

    try {
      const response = await processAdharOCR(frontImage, backImage || undefined);
      setApiResponse(response);
      
      if (response.status && response.data) {
        setParsedData(response.data);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Error processing images:', error);
      setApiResponse({
        status: false,
        message: 'Failed to process images. Please try again.',
        error: 'Network error'
      });
      setShowResults(true);
    } finally {
      setIsProcessing(false);
    }
  };
   const resetForm = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setParsedData(null);
    setApiResponse(null);
    setShowResults(false);
  };
  
  return (
    <>
   
   <div className="min-h-screen bg-gray-100 py-10">
  <h1 className="text-2xl font-bold text-center mb-6">Aadhaar OCR</h1>

  <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
    {!showResults ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div className="flex flex-col space-y-6">
          <ImageUpload
            label="Aadhaar Front"
            onImageSelect={handleFrontImageSelect}
            preview={frontPreview}
            isRequired={true}
          />
          <ImageUpload
            label="Aadhaar Back"
            onImageSelect={handleBackImageSelect}
            preview={backPreview}
            isRequired={false}
          />
          <button
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleParseAadhaar}
            disabled={isProcessing || !frontImage}
          >
            {isProcessing ? 'PROCESSING...' : 'PARSE AADHAAR'}
          </button>
        </div>

       
        <div className="flex flex-col justify-center items-center bg-gray-50 p-6 rounded border border-gray-300">
          <h3 className="text-lg font-semibold mb-4">API Response</h3>
          <p className="text-gray-600 text-center">
            Start Performing OCR by uploading your Aadhaar front and back images.
          </p>
        </div>
      </div>
    ) : (
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Aadhaar Front</h4>
            {frontPreview && (
              <img
                src={frontPreview}
                alt="Aadhaar Front"
                className="w-full rounded shadow"
              />
            )}
            <p className="text-gray-600 text-sm mt-1 cursor-pointer" onClick={resetForm}>
              Press to re-capture/Upload
            </p>
          </div>
          {backPreview && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Aadhaar Back</h4>
              <img
                src={backPreview}
                alt="Aadhaar Back"
                className="w-full rounded shadow"
              />
              <p className="text-gray-600 text-sm mt-1 cursor-pointer" onClick={resetForm}>
                Press to re-capture/Upload
              </p>
            </div>
          )}
          <button
            className="mt-4 w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700"
            onClick={resetForm}
          >
            UPLOAD NEW IMAGES
          </button>
        </div>
        <div className="space-y-6">
          {parsedData && <ParsedData data={parsedData} />}
          {apiResponse && <ApiResponseData response={apiResponse} />}
        </div>
      </div>
    )}
  </div>
</div>


    </>
  )
};

export default App
