import connectMongoDB from "@/lib/mongodb";
import Attachment from "@/models/attachment";
import Course from "@/models/course";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req,{params}){
    try {
        const {userId}=auth();
        const { courseId } = params;
        const {url}=await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        await connectMongoDB();
        const course = await Course.findOne({_id: courseId})

        console.log("courseOwner :::: ",course)
        if(!course){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const attachment = await Attachment.create({url,name:url.split("/").pop(),course:courseId })
        await course.attachments.push(attachment);
        await course.save();

        return NextResponse.json(attachment)
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS",error)
        return new NextResponse("Internal Error",{status : 500})
    }
}