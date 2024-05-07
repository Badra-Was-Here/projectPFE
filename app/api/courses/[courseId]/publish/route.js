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

        const publishedCourse = await Course.findByIdAndUpdate(params.courseId, {
            isPublished: true,
          });
        
        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}