import connectMongoDB from "@/lib/mongodb";
import { Chapter, MuxData } from "@/models/chapter";
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
   

    const unpublishedChapter = await Chapter.findByIdAndUpdate(params.chapterId, {
      isPublished: false,
    });

    // seeing all course chapters which are publiched 
    const publishedChaptersInCourse = await Chapter.find({course: params.courseId , isPublished: true,});

     // Check if there are no published chapters in the course
     if (!publishedChaptersInCourse.length) {
        // Update the course to mark it as unpublished
        await Course.findByIdAndUpdate(params.courseId, { isPublished: false });
    }

    return NextResponse.json(unpublishedChapter);

  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
