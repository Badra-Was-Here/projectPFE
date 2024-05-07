'use client'
import * as z from 'zod';
import axios from 'axios';
import {zodResolver} from "@hookform/resolvers/zod"
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {From ,FormControl,FormDescription,FormField,FormLabel,FormMessage, FormItem  } from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title : z.string().min(1,{
    message : "title is required"
  })
})


export default function CreatePage() {
  const router =useRouter();
  const form = useForm({
    resolver : zodResolver(formSchema),
    defaultValues : {
      title: ""
    }
  })

  const {isSubmitting,isValid}=form.formState;

  async function onSubmit(values){
    try {
      const res = await axios.post("/api/courses",values)
      
      router.push(`/teacher/courses/${res.data._id}`)
      toast.success("Course created")
    } catch  {
      toast.error("Something went wrong!")
    }
  }



  return (
    <div className='max-w-5xl mx-auto bg-slate-400/30 flex md:items-center md:justify-center  h-full p-6 '>
      <div>
        <h1 className='text-2xl'>
          Name your course
        </h1>
        <p className='text-sm text-slate-600'>
          what would you like to name this course?
        </p>

        <FormProvider {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=' space-y-8 mt-8'
          >
            <FormField
                control={form.control}
                name="title"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>
                      Course title
                    </FormLabel>
                    <FormControl>
                      <Input
                          disabled={isSubmitting}
                          placeholder="blaaa"
                          {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      what will you teach in this course?
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
            />
            <div className='flex items-center gap-x-2'>
              <Link href="/">
                <Button 
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                  type="submit"
                  disabled = {!isValid || isSubmitting }
              >
                Continue
              </Button>
            </div>
          </form>
        </FormProvider>

   
      </div>
    </div>
  )
}
