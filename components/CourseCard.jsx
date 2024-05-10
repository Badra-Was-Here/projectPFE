import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { BookOpen } from "lucide-react";
import CourseProgress from "./CourseProgress";
import { cn } from "@/lib/utils";


export default function CourseCard({id,title,imageUrl,chaptersLength,price,progress,category}) {
  return (
    <Link href={`/courses/${id}`}>
        <div className={cn("group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full",
            progress === 100 && " bg-emerald-600/10"
        )}>
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image
                    fill
                    className="object-cover"
                    alt={title}
                    src={imageUrl}
                />
            </div>
            <div className="flex flex-col pt-2">
                <div className="text-lg font-medium group-hover:text-sky-700 transition line-clamp-2">
                    {title}
                </div>
                <p className="text-xs text-muted-foreground ">
                    {category}
                </p>
                <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                    <div className="flex items-center gap-x-1 text-slate-500">
                        <IconBadge size="sm" icon={BookOpen} />
                        <span>
                            {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                        </span>
                    </div>
                </div>
                {progress !== null ? (
                    <CourseProgress
                        variant={progress === 100 ? "success" : "default"}
                        size="sm"
                        value={progress}
                    />
                    // <div>
                    //     TOdo: progress componant
                    // </div>
                ) : (
                    <p className="text-md md:text-sm font-medium text-slate-700">
                    {price} <span className="text-sm font-bold text-green-800">د.ت</span>
                    </p>
                     )
                }

            </div>
        </div>
    </Link>
  )
}
