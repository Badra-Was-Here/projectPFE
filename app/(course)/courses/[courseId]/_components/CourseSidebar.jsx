
import connectMongoDB from "@/lib/mongodb"
import { Purchase } from "@/models/purchase";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./CourseSidebarItem";
import CourseProgress from "@/components/CourseProgress";

export default async function CourseSidebar({course,progressCount}) {
    
    const { userId } = auth();

    if (!userId) {
      return redirect("/");
    }

    await connectMongoDB();
    const purchase = await Purchase.findOne({
        userId,
        courseId : course._id,
    });

    console.log("purchese is ::",purchase);

    

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-7 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
               {purchase &&(
                    <div className="mt-10" >
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
               )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter._id}
                        id={chapter._id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course._id}
                        isLocked={!chapter.isFree && !purchase}
                    /> 
                ))}
            </div>
        </div>
  )
}
