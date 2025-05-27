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
   
    <div className="app">
      <div className="container">
        {!showResults ? (
          <div className="upload-section">
            <h1 className="section-label">(a)</h1>
            
            <div className="upload-grid">
              <div className="upload-area">
                <ImageUpload
                  label="Aadhaar Front"
                  onImageSelect={handleFrontImageSelect}
                  preview={frontPreview}
                  isRequired={true}
                />
              </div>
              
              <div className="api-response-preview">
                <h3>API Response</h3>
                <div className="response-box">
                  <p>Start Performing OCR by inputting your Aadhaar front and back</p>
                </div>
              </div>
            </div>

            <div className="upload-area">
              <ImageUpload
                label="Aadhaar Back"
                onImageSelect={handleBackImageSelect}
                preview={backPreview}
                isRequired={false}
              />
            </div>

            <button 
              className="parse-button"
              onClick={handleParseAadhaar}
              disabled={isProcessing || !frontImage}
            >
              {isProcessing ? 'PROCESSING...' : 'PARSE AADHAAR'}
            </button>
          </div>
        ) : (
          <div className="results-section">
            <div className="results-grid">
              <div className="images-section">
                <div className="image-preview">
                  <h4>Aadhaar Front</h4>
                  {frontPreview && (
                    <img src={frontPreview} alt="Aadhaar Front" className="preview-image" />
                  )}
                  <p className="capture-text">Press to re-capture/Upload</p>
                </div>
                
                {backPreview && (
                  <div className="image-preview">
                    <h4>Aadhaar Back</h4>
                    <img src={backPreview} alt="Aadhaar Back" className="preview-image" />
                    <p className="capture-text">Press to re-capture/Upload</p>
                  </div>
                )}

                <button 
                  className="parse-button"
                  onClick={resetForm}
                >
                  UPLOAD NEW IMAGES
                </button>
              </div>

              <div className="data-section">
                {parsedData && <ParsedData data={parsedData} />}
                {apiResponse && <ApiResponseData response={apiResponse} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      
    </>
  )
};

export default App
