'use client'

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core";

export function FileUpload({onChange,endpoint}) {

  return (
    <UploadDropzone
    endpoint={endpoint}
    onClientUploadComplete={(res) => {
        console.log("onClientUploadComplete res:", res);
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        toast.error(`${error?.message}`);
      }}
    
    
    />
  )
}
