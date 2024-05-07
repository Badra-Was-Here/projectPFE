import connectMongoDB from "@/lib/mongodb";
import Attachment from "@/models/attachment";
import Course from "@/models/course";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function DELETE(req,{params}){
    try {
    const {userId}=auth(); 
    const {attachmentId,courseId}= params;
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectMongoDB();
    // await Attachment.findByIdAndDelete(attachmentId);
    
 // Delete the attachment
 const deletedAttachment = await Attachment.findByIdAndDelete(attachmentId);
    // Remove the attachment from the corresponding course


    await Course.findByIdAndUpdate(courseId, { $pull: { attachments: attachmentId } });

    return NextResponse.json({message : "attachment deleted"},{status: 200})
    } catch (error) {
        console.log("ATTACHMENT_ID",error)
        return new NextResponse("Internal Error",{status : 500})

    }
   
}

