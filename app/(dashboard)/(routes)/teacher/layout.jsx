import teacher from "@/lib/teacher";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export default function layout({children}) {
  const {userId}= auth();
  if (!teacher(userId)) {
    return redirect("/")
  }
    return (
    <>
        {children}
    </>
  )
}
