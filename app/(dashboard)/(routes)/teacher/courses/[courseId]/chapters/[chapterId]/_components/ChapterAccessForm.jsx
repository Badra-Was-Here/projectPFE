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
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    isFree: z.boolean().default(false),
  });







export default function ChapterAccessForm({initialData , courseId,chapterId}) {
    
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree : !!initialData.isFree
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values){
    
    try {
      console.log(values);

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success("chapter updated");
      setIsEditing((e)=>!e)
      router.refresh();
    } catch  {
      toast.error("something was wrong !");
    }
  }

  console.log("initialdata :: ",initialData)


    return (
    <div className="mt-6 border  bg-slate-100 rounded-md p-4">
      <div className="font-medium flex   justify-between items-center">
          Chapter access 
          <Button onClick={()=>setIsEditing((e)=>!e)} variant="ghost">
            {isEditing && (
              <>
                Cancel
              </>
            )}

            {!isEditing && (
              <>
                 <Pencil className="h-4 w-4 mr-2"/>
                 Edit access
              </>
            )}


          </Button>
      </div>
      {!isEditing &&(
        <p className={cn(
          "text-sm mt-2",
          !initialData.isFree && "text-slate-500 italic"
        )}>
          {initialData.isFree ? (
            <>
              This chapter is free for preview.
            </>
          ):(
            <>This chapter is not free. </>
          )}
        </p>
      )}
      {isEditing &&(
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 text-gray-200"
          >
             <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ">
                  <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                      <FormDescription>
                        Check this box if you want to make this chapter free for preview
                      </FormDescription>
                  </div>
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
