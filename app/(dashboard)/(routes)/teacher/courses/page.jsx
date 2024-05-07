import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_components/DataTable'
import { columns } from './_components/Columns'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Course from '@/models/course'




export default async function CoursesPage() {
  const {userId} = auth();
  if(!userId){
    return redirect("/")
  }
  const courses = await Course.find({userId: userId}).sort({ createdAt: -1 });

  return (
    <div className='p-6'>
      {/* <Link href="/teacher/create">
        <Button >
          New course
        </Button>
      </Link> */}
      <DataTable columns={columns} data={courses} />
    </div>
  )
}
