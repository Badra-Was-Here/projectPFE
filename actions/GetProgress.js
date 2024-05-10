
import connectMongoDB from "@/lib/mongodb";
import { Chapter, UserProgress } from "@/models/chapter";


export default async function GetProgress(userId,courseId) {
    try {
        await connectMongoDB();
          // Find published chapters and select only their IDs
        const publishedChapters = await Chapter.find({course: courseId, isPublished: true }).select('_id');
        
        // Extract IDs from the published chapters
        const publishedChapterIds = publishedChapters.map(chapter => chapter._id);

        // Count the number of completed chapters for the current user
        const validCompletedChapters = await UserProgress.countDocuments({
            userId,
            chapterId: { $in: publishedChapterIds },
            isCompleted: true,
        });

         //calucate progress percentage:
        // completed chapters / total published chapters
        const progressPercentage = (validCompletedChapters / publishedChapters.length) * 100;
        return progressPercentage;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}
