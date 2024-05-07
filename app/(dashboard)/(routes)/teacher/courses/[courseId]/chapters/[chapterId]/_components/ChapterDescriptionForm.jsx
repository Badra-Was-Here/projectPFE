"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";

const formSchema = z.object({
    description: z.string().min(1),
  });







export default function ChapterDescriptionForm({initialData , courseId,chapterId}) {
    
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values){
    
    try {
      console.log(values);

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success("Chapter description updated");
      setIsEditing((e)=>!e)
      router.refresh();
    } catch  {
      toast.error("something was wrong !");
    }
  }



    return (
    <div className="mt-6 border  bg-slate-100 rounded-md p-4">
      <div className="font-medium flex   justify-between items-center">
          Chapter description
          <Button onClick={()=>setIsEditing((e)=>!e)} variant="ghost">
            {isEditing && (
              <>
                Cancel
              </>
            )}

            {!isEditing && (
              <>
                 <Pencil className="h-4 w-4 mr-2"/>
                 Edit description
              </>
            )}


          </Button>
      </div>
      {!isEditing &&(
        <div className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview
              value={initialData.description}
            />
          )}
        </div>
      )}
      {isEditing &&(
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 text-black"
          >
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
