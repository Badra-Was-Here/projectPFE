import connectMongoDB from "@/lib/mongodb";
import { Chapter, MuxData } from "@/models/chapter";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import Course from "@/models/course";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// delete chapter data

export async function DELETE(req,{params}){
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectMongoDB();
    const chapter = await Chapter.findById(params.chapterId);
    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }
    if (chapter.videoUrl){
       // Find existing MuxData document based on chapterId
       const existingMuxData = await MuxData.findOne({ chapterId: params.chapterId });

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
    const deletedChapter = await Chapter.findByIdAndDelete(params.chapterId)

    // Remove chapter ID from the chapters array in the Course model
    await Course.findByIdAndUpdate( params.courseId , { $pull: { chapters: params.chapterId} });


    // seeing all course chapters which are publiched 
    const publishedChaptersInCourse = await Chapter.find({course: params.courseId , isPublished: true,});
    console.log(publishedChaptersInCourse);
    console.log(publishedChaptersInCourse.length);

    // Check if there are no published chapters in the course
    if (!publishedChaptersInCourse.length) {
      // Update the course to mark it as unpublished
      await Course.findByIdAndUpdate(params.courseId, { isPublished: false });
     }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// update the chapter data

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectMongoDB();
    const chapter = await Chapter.findByIdAndUpdate(params.chapterId, {
      ...values,
    });

    // TODO : Handel Video Uplaod

        // Check if values.videoUrl exists
if (values.videoUrl) {
    try {
        // Find existing MuxData document based on chapterId
        const existingMuxData = await MuxData.findOne({ chapterId: params.chapterId });

        // If existing MuxData document exists, delete its asset
        if (existingMuxData) {
            await mux.video.assets.delete(existingMuxData.assetId);
            console.log('Mux asset deleted successfully');

            // Delete the existing MuxData document
            await MuxData.findByIdAndDelete(existingMuxData._id);
            console.log('Existing MuxData document deleted successfully');
        }

        // Create new asset using values.videoUrl
        const asset = await mux.video.assets.create({
            input: values.videoUrl,
            playback_policy: "public",
            test: false,
        });

        // If asset creation is successful, create new MuxData document
        if (asset) {
            const newMuxData = await MuxData.create({
                chapterId: params.chapterId,
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
            });
            console.log('New MuxData document created successfully', newMuxData);

            // Update the Chapter's muxdata field with the new MuxData entry's _id
            chapter.muxData = newMuxData._id;
            await chapter.save();
        }

    } catch (error) {
        console.error('[Mux Asset and MuxData Handling]', error);
        throw new Error('Failed to handle Mux asset and MuxData');
    }
}



    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSE_CHAPTER_ID]", error);
    return new NextResponse("Internal error ", { status: 500 });
  }
}
