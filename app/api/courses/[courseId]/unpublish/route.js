import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/course";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(req, { params }) {
    try {
        const { userId } = auth();
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
        }
        
        await connectMongoDB();

        const unpublishedCourse = await Course.findByIdAndUpdate(params.courseId, {
            isPublished: false,
          });
        
        return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}