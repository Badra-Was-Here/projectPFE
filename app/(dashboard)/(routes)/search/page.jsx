import connectMongoDB from "@/lib/mongodb"
import Category from "@/models/category"
import Categories from "./_components/Categories";
import { GetCourses } from "@/actions/GetCourses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CoursesList from "@/components/CoursesList";

export default async function SearchPage({searchParams}) {
  const {userId}=auth();
  if(!userId){
    return redirect("/");
  }

  await connectMongoDB();
  const categories = await Category.find().sort({name:1});

  console.log(categories)

  const courses = await GetCourses({userId, ...searchParams});
  console.log("seach course page :::",courses)

  return (
    <div className="p-6 space-y-4">
      <Categories
        items={categories}
      />
      <CoursesList
        items={courses}
      />
    </div>
  )
}
