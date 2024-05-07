"use client"
import * as z from "zod";
import axios from "axios";

import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import Image from "next/image";








export  default  function AttachmentForm({initialData , courseId,atta}) {
    
  const [isEditing, setIsEditing] = useState(false);
  const [deleting,setDeleting]=useState(null);
  const router = useRouter();


  async function onSubmit(values){
    
    try {
      console.log(values);

      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success("Attachment updated");
      setIsEditing((e)=>!e)
      router.refresh();
      
    } catch (error) {
      toast.error("something was wrong !");
      console.log(error)
      

    }
  }

  async function onDelete(id){
    try {
      setDeleting(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      // console.log("id = ", id)
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("something was wrong !");
    }finally{
      setDeleting(null)
    }
  }





    return (
    <div className="mt-6 border  bg-slate-100 rounded-md p-4">
      <div className="font-medium flex   justify-between items-center">
          Course Attachments
          <Button onClick={()=>setIsEditing((e)=>!e)} variant="ghost">
            {isEditing && (
              <>
                Cancel
              </>
            )}

            {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an file
            </>
            )}



          </Button>
      </div>
      {!isEditing &&(
         <>
         {console.log('initialData= ',initialData)}
            {initialData.attachments.length === 0 && (
              <p className="text-sm mt-2 text-slate-500 italic ">
                No attachments yet
              </p>
            )} 
            {initialData.attachments.length >0 && (
              <div className="space-y-2">
                  {atta.map((at)=>(
                    // console.log(at._id)
                    <div key={at._id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md  ">
                        <File className="h-4 w-4 flex-shrink-0 mr-1"/>
                        <p className="text-sm line-clamp-1">
                          {at.name}
                        </p>
                        {deleting === at._id &&(
                          <div>
                            <Loader2 className="h-4 w-4 animate-spin"/>
                          </div>
                        )}
                        {deleting !== at._id &&(
                          <button onClick={()=>onDelete(at._id)} className="ml-auto p-[1px]  bg-rose-500 rounded-sm hover:opacity-65  ">
                            <X className="h-4 w-4 text-white"/>
                          </button>
                        )}
                    </div>
                  ))}
              </div>
            )}
         </>
      )}
      {isEditing &&(
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url)=>{
              if(url){
                onSubmit({url:url})
              }
            }}

          />
          <div className="text-xs text-muted-foreground mt-6   ">
              Add anything your students need to complete the course.
          </div>
        </div>
      )}
    </div>
  )
}
