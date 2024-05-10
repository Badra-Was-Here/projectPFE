import connectMongoDB from "@/lib/mongodb";
import Category from "@/models/category";

import Course from "@/models/course";
import GetProgress from "@/actions/GetProgress";
import { Purchase } from "@/models/purchase";



export default async function GetDashboardCourses(userId) {
    try {
        await connectMongoDB();
        const purchasedCourses = await Purchase.find({userId}).populate({
            path: "courseId",
            populate:[
            {
                path: "category",
                model: Category // Use the imported Category model
            },
            {
                path: "chapters",
                match: { isPublished: true }, // Filter only published chapters
                // select: "_id title position", // Select the fields you want from the Chapter document
                options: { sort: { position: 1 } } // Sort chapters by position
            }
        ]
        }).select("courseId");
        
        const courses = purchasedCourses.map((purchase) => purchase.courseId);

        for (let course of courses) {
            const progress = await GetProgress(userId, course._id); // Use _id for ObjectId
            course.progress = progress;
            // course["progress"] = progress;
        }
        // Handle completed and courses in progress
        const completedCourses = courses.filter((course) => course.progress === 100);
        // Handle null progress
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);
        return {
            completedCourses,
            coursesInProgress
        }
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]: ", error);
        return {
            completedCourses: [],
            coursesInProgress: []
        }
    }
}
