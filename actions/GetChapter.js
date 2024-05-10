import connectMongoDB from "@/lib/mongodb";
import Attachment from "@/models/attachment";
import { Chapter, MuxData, UserProgress } from "@/models/chapter";
import Course from "@/models/course";
import { Purchase } from "@/models/purchase";

export async function GetChapter({userId,courseId,chapterId}) {
  try {
        await connectMongoDB();

         // Find the course to check if it's published and get its price
         const course = await Course.findOne({ _id: courseId, isPublished: true }).select("price");
         // Find the chapter by its ID and check if it's published
        const chapter = await Chapter.findOne({ _id: chapterId, isPublished: true });

        // If chapter or course not found, throw an error
        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        } 

        let muxData = null;
        let attachments = [];
        let nextChapter = null;

        // Check if the user has purchased the course
        const purchase = await Purchase.findOne({ userId, courseId });

        if (purchase) {
            // If the user has purchased the course, fetch attachments related to the course
            attachments = await Attachment.find({course : courseId });
        }

         // If the chapter is free or the user has purchased the course
         if (chapter.isFree || purchase) {
            // Find muxData associated with the chapter
            muxData = await MuxData.findOne({ chapterId });

            // Find the next chapter after the current chapter
            nextChapter = await Chapter.findOne({ 
                course : courseId,
                isPublished: true,
                position: { $gt: chapter.position }
            }).sort({ position: 1 });
        }

        // Find user progress for the chapter
        const userProgress = await UserProgress.findOne({ userId, chapterId });

        // Return the retrieved data
        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        };


  } catch (error) {
    console.log("[GET_CHAPTER]",error);
    return {
        chapter: null,
        course: null,
        muxData: null,
        attachments: [],
        nextChapter: null,
        userProgress: null,
        purchase: null,
    }
  }
}
