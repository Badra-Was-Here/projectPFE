import connectMongoDB from "@/lib/mongodb";
import Category from "@/models/category";

import Course from "@/models/course";
import GetProgress from "@/actions/GetProgress";
import { Purchase } from "@/models/purchase";

export  async function GetCourses({ userId, title, categoryId }) {
  try {
    await connectMongoDB();

    const courses = await Course.find({
      isPublished: true,
      title: { $regex: title || "", $options: "i" }, // Case-insensitive search
      ...(categoryId && { category: categoryId }),
    })
      .populate("category")
      .populate({
        path: "chapters",
        match: { isPublished: true },
        select: "_id",
      })
      .populate({
        path: "purchases",
        match: { userId },
        
        
      })
      .sort({ createdAt: "desc" });

            // Check if the user has purchased the courses
            
              
              // const purchase = await Purchase.findOne({ userId, courseId });  
            

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }
        const progressPercentage = await GetProgress(userId, course._id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );
    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}
