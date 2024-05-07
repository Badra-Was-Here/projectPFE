import connectMongoDB from "@/lib/mongodb";
import { Chapter, MuxData } from "@/models/chapter";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectMongoDB();
    const chapter = await Chapter.findById(params.chapterId);
    const muxData = await MuxData.findOne({ chapterId: params.chapterId });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await Chapter.findByIdAndUpdate(params.chapterId, {
      isPublished: true,
    });

    return NextResponse.json(publishedChapter);

  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
