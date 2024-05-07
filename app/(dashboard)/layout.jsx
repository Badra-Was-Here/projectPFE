import MySidebar from "./_components/MySidebar"
import Navbar from "./_components/Navbar"



export default function DashboardLayout({ children }) {
  return (
  <div className=" h-full ">
    <div className="h-[80px] bg-green-200 pl-56  fixed inset-y-0 z-50 w-full">
        <Navbar/>
    </div>
    <div className="flex h-full w-56 flex-col fixed inset-y-0 z-50 bg-blue-500">
        <MySidebar/>
    </div>
    <main className="pl-56 h-full pt-[80px]">
       {children}
    </main>
   
  </div>
)
}
