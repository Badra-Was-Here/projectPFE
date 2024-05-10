import { GetChapter } from "@/actions/GetChapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/Preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";

export default async function ChapterIdPage({params}) {
  
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await GetChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }

  const isLocked = !chapter.isFree && !purchase;
  // set completeOnEnd to true if the user has purchased the course and has not completed the chapter yet. Otherwise, it will be set to false.
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;


  return (
    <div>
      {userProgress?.isCompleted && (
          <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
          <Banner
            variant="warning"
            label="You need to purchase this course to watch this chapter."
          />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
              chapterId={params.chapterId}
              title={chapter.title}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
        </div>
        <div>
          <div className="p-4 flex  md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ?(
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ):(
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price}
              />
            )}
          </div>
          <Separator/>
          <div>
            <Preview
              value = {chapter.description}
            />
          </div>
          {!!attachments.length &&(
            <>
              <Separator/>
              <div className="p-4 space-y-1">
                {attachments.map((attachment) => (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    key={attachment._id}
                    className= "flex items-center  p-3 w-full bg-sky-200 border rounded-md text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="ml-2 line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  )
}
