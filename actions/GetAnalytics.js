import connectMongoDB from "@/lib/mongodb";
import Category from "@/models/category";

import Course from "@/models/course";
import GetProgress from "@/actions/GetProgress";
import { Purchase } from "@/models/purchase";
import Attachment from "@/models/attachment";

// const groupByCourse =(purchases) =>{
//     const grouped = {};
//     purchases.forEach((purchase) => {
//         console.log(purchase)
//         //  const courseTitle = purchase.courseId.title;
//          const courseTitle = purchase.courseId.title;
//          const coursePrice = purchase.courseId.price;
//          console.log("courseTitle:::",purchase.courseId.title);
//          if (!grouped.courseTitle) {
//             grouped.courseTitle = 0;

//         }
//         grouped.courseTitle += purchase.courseId.price ;

        
//     })
//     console.log("goupedd:::",grouped)
//     return grouped ;
// }

// export  async function GetAnalytics(userId) {
//     try {
//         // const purchasedCourses = await Purchase.find({userId}).populate({
//         //     path: "courseId",
//         //     match: { userId: userId },
//         //     populate:
//         //     {
//         //         path: "chapters",
//         //         match: { isPublished: true }, // Filter only published chapters
//         //         // select: "_id title position", // Select the fields you want from the Chapter document
//         //         options: { sort: { position: 1 } } // Sort chapters by position
//         //     }
        
//         // }).select("courseId");

//     // Find all purchases for a user
//     const purchases = await Purchase.find({
//         userId: userId, 
//     }).populate('courseId'); // Populate the course field

//     console.log("purrrrr::",purchases)
//     // Group purchases by course and calculate total earnings
//     const groupedEarnings = groupByCourse(purchases);
//     const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
//       name: courseTitle,
//       total: total,
//     }));

//     const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
//     const totalSales = purchases.length;

//     // calculate totle attachments and totale chapters
//     const courses = await Course.find({userId}).populate({
//         path: "chapters",
//         match: { isPublished: true },
//         select: "_id",
//       })

//     // Count the total number of chapters across all courses
//     let totalChapters = 0;
//     let totalAttachments = 0; 
//     for (const course of courses) {
//         // const chapters = await Chapter.find({ courseId: course._id });
//         totalAttachments += course.attachments.length
//         totalChapters += course.chapters.length;
//     }  

//     console.log("totalAttachments ::::", totalAttachments)
//     console.log("totalChapters ::::", totalChapters)




//     return {
//         data,
//         totalRevenue,
//         totalSales,
//         totalChapters,
//         totalAttachments,
//       }
        
//     } catch (error) {
//         console.log("[GET_ANALYTICS]", error);
//         return {
//             data: [],
//             totalRevenue: 0,
//             totalSales: 0,
//             totalChapters : 0,
//             totalAttachments : 0,
//           }
//     }
// }
const groupByCourse = (purchases) => {
    const grouped = {};
    purchases.forEach((purchase) => {
        const courseTitle = purchase.courseId.title;
        const coursePrice = purchase.courseId.price;

        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += coursePrice;
    });
    return grouped;
};

export default async  function GetAnalytics(userId) {
    try {
        const purchases = await Purchase.find({ userId }).populate('courseId');

        const groupedEarnings = groupByCourse(purchases);
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        const courses = await Course.find({ userId }).populate({
            path: 'chapters',
            match: { isPublished: true },
            select: '_id',
        });

        let totalChapters = 0;
        let totalAttachments = 0;
        for (const course of courses) {
            totalAttachments += course.attachments.length;
            totalChapters += course.chapters.length;
        }

        console.log('Total Attachments:', totalAttachments);
        console.log('Total Chapters:', totalChapters);

        return {
            data,
            totalRevenue,
            totalSales,
            totalChapters,
            totalAttachments,
        };
    } catch (error) {
        console.log('[GET_ANALYTICS]', error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
            totalChapters: 0,
            totalAttachments: 0,
        };
    }
}
