// import { IconBadge } from "@/components/icon-badge";
// import connectMongoDB from "@/lib/mongodb";
// import Course from "@/models/course";
// import { auth } from "@clerk/nextjs";
// import { LayoutDashboard } from "lucide-react";
// import { redirect } from "next/navigation";
// import TitleForm from "./_components/TitleForm";
// import DescriptionForm from "./_components/DescriptionForm";
// import ImageForm from "./_components/ImageForm";
// import Category from "@/models/category.js";
// import CategoryForm from "./_components/CategoryForm";
// import { Label } from "@radix-ui/react-label";
// import { Combobox, ComboboxDemo, ComboboxForm } from "@/components/ui/combobox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// export default async function CourseIdPage({ params }) {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }

//   await connectMongoDB();

//   // try {
//   //   const course = await Course.findById(params.courseId);

//   //   const requiredField = [
//   //     course.title,
//   //     course.description,
//   //     course.imageUrl,
//   //     course.price,
//   //     course.category,
//   //   ]

//   //   const totalFields = requiredField.length;
//   //   const completedFields = requiredField.filter(Boolean).length;
//   //   const completionText = `(${completedFields} / ${totalFields})`;

//   // } catch {
//   //   return redirect('/');
//   // }

//   const course = await Course.findById(params.courseId);

//   const categories = await Category.find();

//   console.log("Categories:", categories);


// const options = categories.map((category) => ({
//   label: category.name,
//   value: category.id,
// }));
// console.log("Options:", options);


//   if (!course) {
//     return redirect("/");
//   }

//   const requiredField = [
//     course.title,
//     course.description,
//     course.imageUrl,
//     course.price,
//     course.category,
//   ];

//   const totalFields = requiredField.length;
//   const completedFields = requiredField.filter(Boolean).length;
//   const completionText = `(${completedFields} / ${totalFields})`;

//   return (
//     <div className="p-6">
//       <div className=" flex items-center justify-between">
//         <div className="flex flex-col gap-y-2">
//           <h1 className="text-2xl font-medium">Course setup</h1>
//           <span className="text-sm text-slate-700">
//             Complete all fields {completionText}
//           </span>
//         </div>
//       </div>
//       <div className=" grid grid-cols-2 gap-6 mt-16">
//         <div>
//           <div className="flex items-center gap-x-2">
//             <IconBadge icon={LayoutDashboard} />
//             <h2 className="text-xl">Customize your course</h2>
//           </div>
//           <TitleForm initialData={course} courseId={course.id} />
//           <DescriptionForm initialData={course} courseId={course.id} />
//           <ImageForm initialData={course} courseId={course.id} />

          
     
//         </div>
//       </div>
//     </div>
//   );
// }



import { IconBadge } from "@/components/icon-badge";
import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/course";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import Category from "@/models/category.js";
import CategoryForm from "./_components/CategoryForm";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentsForm";
import Attachment from "@/models/attachment";
import ChaptersForm from "./_components/ChaptersForm";
import { Chapter } from "@/models/chapter";
import Banner from "@/components/Banner";
import Actions from "./_components/Actions";


export default async function CourseIdPage({ params }) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  await connectMongoDB();

  // Load course data
  const course = await Course.findById(params.courseId);
  if (!course) {
    return redirect("/");
  }

  // Load categories data
  const categories = await Category.find();
  const options = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  // load attachments data 
  const atta = await Attachment.find({course})
  
  // load chapters data 
  const chap = await Chapter.find({course}).sort({ position: 1 });
  
  // Calculate completion text
  const requiredField = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.category,
    chap.some(ch=>ch.isPublished),
  ];
  const totalFields = requiredField.length;
  const completedFields = requiredField.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredField.every(Boolean);

  return (
    <>
       {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        
        </div>
        <div className="grid grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm initialData={course} courseId={course.id} options={options} />
          </div>
          <div className="space-y-6 ">
            <div>
              <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Course Chapters</h2>
              </div>
              <div>
              <ChaptersForm initialData={course} courseId={course.id} chap={chap} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm
                initialData={course} 
                courseId={course.id}
                
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                    <h2 className="text-xl">Resourses & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} atta={atta} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
