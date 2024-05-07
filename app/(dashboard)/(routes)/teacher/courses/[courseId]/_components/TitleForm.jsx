"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
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

const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
  });







export default function TitleForm({initialData , courseId}) {
    
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

      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success("Course title updated");
      setIsEditing((e)=>!e)
      router.refresh();
    } catch  {
      toast.error("something was wrong !");
    }
  }



    return (
    <div className="mt-6 border  bg-slate-100 rounded-md p-4">
      <div className="font-medium flex   justify-between items-center">
          Course title
          <Button onClick={()=>setIsEditing((e)=>!e)} variant="ghost">
            {isEditing && (
              <>
                Cancel
              </>
            )}

            {!isEditing && (
              <>
                 <Pencil className="h-4 w-4 mr-2"/>
                 Edit title
              </>
            )}


          </Button>
      </div>
      {!isEditing &&(
        <p className="text-sm mt-2">
          {initialData.title}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='text-gray-700'
                      disabled={isSubmitting}
                      placeholder=" exemple : this is my course title"
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
