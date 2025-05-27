import React, { useRef } from "react";

interface ImageUploadProps{
    label:string;
    onImageSelect:(file:File)=>void;
    preview:string |null;
    isRequired:boolean;
}


const ImageUpload:React.FC<ImageUploadProps>=({
    label,
    onImageSelect,
    preview,
    isRequired
})=>{
    const fileInputRef=useRef<HTMLInputElement>(null)

    const handleClick=()=>{
        fileInputRef.current?.click();
    }

    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const file=event.target.files?.[0];
        if(file){
            onImageSelect(file)
        }
    }

    const handleDragOver=(event:React.DragEvent)=>{
        event.preventDefault();
    }

    const handleDrop=(event:React.DragEvent)=>{
        event.preventDefault();
        const file=event.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
         onImageSelect(file);
    }
    }

    return(
        <div className="image-upload">
             <h3 className="upload-label">{label}</h3>
      <div 
        className={`upload-box ${preview ? 'has-image' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt={label} className="uploaded-image" />
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 15L12 3M12 3L16 7M12 3L8 7" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V12" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="upload-text">Click here to Upload/Capture</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
        
    )
}

export default ImageUpload