import GetDashboardCourses from "@/actions/GetDashboardCourses";
import CoursesList from "@/components/CoursesList";
import { UserButton, auth } from "@clerk/nextjs";
import { CheckCircle, Clock, InfoIcon, ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";
import BannerCard from "./_components/BannerCard";

export default async function Dashboard() {
  const {userId}= auth();
  if (!userId) {
    return redirect("/");
  }

  const { completedCourses,coursesInProgress} =await GetDashboardCourses(userId);
  console.log("completedCourses,coursesInProgress::: ",completedCourses,coursesInProgress);


  return (
    <div  className="p-6 space-y-4">
       <div className="grid grid-cols-1 gap-4">
        <BannerCard
            icon={InfoIcon}
            label= "Welcome to your dashboard "
            description={`This is where you can see your progress 
            and continue your courses.`}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
        <InfoCard
          icon={ShoppingBag}
          label="Total Purchased"
          numberOfItems={completedCourses.length+coursesInProgress.length}
          // variant="success"
        />
      </div> 
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  );
}
