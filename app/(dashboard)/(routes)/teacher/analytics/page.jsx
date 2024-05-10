// import { GetAnalytics } from '@/actions/GetAnalytics';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import DataCard from './_components/DataCard';
import Chart from './_components/Chart';
import  GetAnalytics  from '@/actions/GetAnalytics';


export default async function AnalyticsPage() {
  
  const { userId } = auth();
    if (!userId) {
        return redirect('/');
    }
    const {
      data,
      totalRevenue,
      totalSales,
      totalChapters,
      totalAttachments,
  } = await GetAnalytics(userId);

  console.log("analitic data ::: ",totalRevenue,totalSales,data )

  return (
    <div className='p-6'>
      <div className='grid grid-cols-2 gap-4 mb-4' >
      <DataCard
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat
      />
      <DataCard 
          label="Total Sales"
          value={totalSales}
          shouldFormat={false}
      />
      <DataCard 
          label="Total Published Chapters"
          value={totalChapters}
          shouldFormat={false}
      />
      <DataCard 
          
          label="Total Publiched Attachments"
          value={totalAttachments}
          shouldFormat={false}
      />
      </div>
      <Chart
          data={data}
      />

    </div>
  )
}
