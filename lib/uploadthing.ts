import {
    generateUploadButton,
    generateUploadDropzone,
    generateReactHelpers, // 🚀 Add this import
  } from "@uploadthing/react";
  
  import type { OurFileRouter } from "@/app/api/uploadthing/core";
  
  // Components
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  
  // 🚀 Add this line to export the hook
  export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();