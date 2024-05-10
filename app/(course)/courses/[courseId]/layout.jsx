import GetProgress from "@/actions/GetProgress";
import connectMongoDB from "@/lib/mongodb"
import Course from "@/models/course";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";

export default async function CourseLayout({children,params}) {
    
    const {userId}=auth();
    if(!userId){
        return redirect("/");
    }
    await connectMongoDB();

    const course = await Course.findById(params.courseId).populate({
        path: 'chapters',
        match: { isPublished: true },
        populate: {
          path: 'userProgress',
          match: { userId },
        },
        options: { sort: { position: 'asc' } },
    });

    if (!course) {
        return redirect("/");
    }
    console.log("showing course data from cousseId/layout :  ",course)

    const progressCount = await GetProgress(userId, course._id);

    return (
    <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed  insert-y-0 w-full z-50 ">
            <CourseNavbar
                course={course}
                progressCount={progressCount}
            />
        </div>
        <div className=" flex h-full w-80 flex-col fixed inset-y-0 z-50">
            <CourseSidebar
                course={course}
                progressCount={progressCount}
            />
        </div>
        <main className="pl-80 pt-[80px] h-full">
            {children}
        </main>
    </div>
  )
}
