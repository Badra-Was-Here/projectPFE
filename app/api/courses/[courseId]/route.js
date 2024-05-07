import connectMongoDB from "@/lib/mongodb";
import { Chapter, MuxData } from "@/models/chapter";
import Course from "@/models/course";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// delete the course
export async function DELETE(req,{params}){
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectMongoDB();
    // const course = await Course.findById(params.courseId);
    // for (const chap of course.chapters) {
    //   console.log("chap::::::",chap)
    //   const chapter = await Chapter.findById(chap)
      
    // }
    const courseChapters = await Chapter.find({course:params.courseId})
    console.log(courseChapters);

    for (const chap of courseChapters){
      console.log(chap);
      if (chap.muxData){
        // Find existing MuxData document based on muxDataId
        const existingMuxData = await MuxData.findById(chap.muxData);
        console.log("existingMuxData : ",existingMuxData)
        // If existing MuxData document exists, delete its asset
        if (existingMuxData) {
            await mux.video.assets.delete(existingMuxData.assetId);
            console.log('Mux asset deleted successfully');
 
            // Delete the existing MuxData document
            await MuxData.findByIdAndDelete(existingMuxData._id);
            console.log('Existing MuxData document deleted successfully');
        }
     }
      //deleting the chapter from databse
       await Chapter.findByIdAndDelete(chap._id);
    }

    //deleting the course from databse
    const deletedCourse = await Course.findByIdAndDelete(params.courseId);

    return NextResponse.json(deletedCourse);

  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}


// update course
export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectMongoDB();
    const course = await Course.findByIdAndUpdate(courseId, { ...values });

    return NextResponse.json(course, {
      message: "course was updated succesfuly ",
    });
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
