import connectMongoDB from "@/lib/mongodb";
import { Chapter } from "@/models/chapter";

import Course from "@/models/course";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectMongoDB();
    // Find the last chapter and get its position
    const lastChapter = await Chapter.findOne({ course: courseId })
      .sort({ position: -1 })
      .exec();

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    // Create a new chapter
    const chapter = await Chapter.create({
      title,
      course: courseId,
      position: newPosition,
    });

    // Find the course by its ID
    const course = await Course.findOne({ _id: courseId });
    // Adding the newly created chapter to the course's chapters array
    await course.chapters.push(chapter);
    await course.save();

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal error ", { status: 500 });
  }
}
