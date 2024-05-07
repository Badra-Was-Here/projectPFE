"use client"
// import dynamic from "next/dynamic";
import { useMemo } from "react";
// import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
// import type ReactQuill from 'react-quill';

export default function Editor({onChange,value}) {
    const ReactQuill =useMemo(()=>dynamic(()=>import("react-quill"),{ssr:false}),[]);

  return (
    <div className="bg-white">
        <ReactQuill
            theme ="snow"
            value = {value}
            onChange = {onChange}      
        />
    </div>
  )
}
