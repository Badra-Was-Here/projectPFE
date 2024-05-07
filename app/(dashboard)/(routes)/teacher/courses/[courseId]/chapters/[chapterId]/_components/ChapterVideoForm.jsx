"use client"
import * as z from "zod";
import axios from "axios";

import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";








export default function ChapterVideoForm({initialData , courseId, chapterId,mux}) {
    
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();


  async function onSubmit(values){
    
    try {
      console.log(values);

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success("Chapter updated");
      setIsEditing((e)=>!e)
      router.refresh();
    } catch  {
      toast.error("something was wrong !");
    }
  }



    return (
    <div className="mt-6 border  bg-slate-100 rounded-md p-4">
      <div className="font-medium flex   justify-between items-center">
          Chapter video
          <Button onClick={()=>setIsEditing((e)=>!e)} variant="ghost">
            {isEditing && (
              <>
                Cancel
              </>
            )}

            {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an a video
            </>
            )}

            {!isEditing && initialData.videoUrl && (
              <>
                 <Pencil className="h-4 w-4 mr-2"/>
                 Edit video
              </>
            )}


          </Button>
      </div>
      {!isEditing &&(
          !initialData.videoUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <Video className="h-10 w-10 text-slate-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2 ">

              <MuxPlayer
                playbackId={mux?.playbackId ||""}
              />
              
            </div>
          )
      )}
      {isEditing &&(
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url)=>{
              if(url){
                onSubmit({videoUrl:url})
              }
            }}

          />
          <div className="text-xs text-muted-foreground mt-6   ">
              Upload this chapter video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing &&(
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  )
}
