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


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const formSchema = z.object({
    category: z.string().min(1, {
      message: "Category  is required",
    }),
  });

export default function CategoryForm({initialData , courseId, options }) {

  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:{
      category : initialData?.category || ""
    },
  });

  // const options = categories.map((category) => ({
  //   label: category.name,
  //   value: category._id,
  // }))
  console.log(options)

  // const newOptions = [
  //   {
  //     value: "next.js",
  //     label: "Next.js",
  //   },
  //   {
  //     value: "sveltekit",
  //     label: "SvelteKit",
  //   },
  // ]

  const selectedOption = options.find(option => option.value === initialData.category);

  
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values){

    try {
      console.log(values);

      await axios.patch(`/api/courses/${courseId}`, values)
      // await axios.patch(`/api/courses/${courseId}`, {category:"laaqq"})
      toast.success("Course Category updated");
      setIsEditing((e)=>!e)
      router.refresh();
    } catch(error)  {
      toast.error("something was wrong !");
      console.log(error);
    }
  }

    return (
    <div className="mt-6 border  bg-slate-100 rounded-md p-4  ">
      <div className="font-medium flex   justify-between items-center">
          Course Category
          <Button onClick={()=>setIsEditing((e)=>!e)} variant="ghost">
            {isEditing && (
              <>
                Cancel
              </>
            )}

            {!isEditing && (
              <>
                 <Pencil className="h-4 w-4 mr-2"/>
                 Edit Category
              </>
            )}

          </Button>
      </div>
      {!isEditing &&(
        <p className={cn(
          "text-sm mt-2",
          !initialData.category && "text-slate-500 italic"
        )}>
          {selectedOption?.label || "No Category"}
        </p>
      )}
      {isEditing &&(
        <Form {...form}  >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 text-gray-200 "
          >
             <FormField 
              
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem  >
                  <FormControl >
                    {/* <Combobox
                      options={options}
                      disabled={isSubmitting}
                      {...field}

                    /> */}
              

            
                      
                    <Select  onValueChange={field.onChange}>
                          <SelectTrigger className="w-full text-slate-500">
                            <SelectValue  placeholder={selectedOption?.label || "select course category "} />
                          </SelectTrigger>
                      
                          <SelectContent  >
                            {
                              options.map((op) => (
                                <SelectItem value={op.value}>{op.label}</SelectItem>
                                  // label: op.name,
                                  // value: op._id,
                                ))
                            }
                          </SelectContent>

                    </Select>

                    
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
