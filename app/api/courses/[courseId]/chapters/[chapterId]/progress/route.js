import connectMongoDB from "@/lib/mongodb";
import { Chapter,  UserProgress } from "@/models/chapter";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PUT(req,{params}){
    try {
        const { userId } = auth();
        const { isCompleted } = await req.json();
    
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
        } 

        await connectMongoDB();
        // Upsert the user progress
        const userProgress = await UserProgress.findOneAndUpdate(
            { userId: userId, chapterId: params.chapterId }, // Query
            { isCompleted: isCompleted }, // Update
            { upsert: true, new: true } // Options : if no document matches the query criteria, a new document will be created with the specified update criteria.
        );

         // Find the chapter
         const chapter = await Chapter.findById(params.chapterId);

         if (!chapter.userProgress.includes(userProgress._id)) {
            chapter.userProgress.push(userProgress);
            await chapter.save();
          }
        // if userprogress_id !== chapter.userpreogress._id
        // update the chapter userprogress array 
        // const updatedChapter = await Chapter.findOneAndUpdate(
        //     { _id: params.chapterId },
        //     { $push: { userProgress: userProgress } }, // Push userId into the userProgress array
        //     { new: true } // Return the updated document
        //   );

        return NextResponse.json(userProgress);
    } catch (error) {
         console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
    }
}