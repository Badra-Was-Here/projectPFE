import connectMongoDB from "@/lib/mongodb";
import CourseCard from "@/components/CourseCard";

export default function CoursesList({ items }) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
        //   <div key={item._doc._id}>
        //      {item._doc.title}
        //   </div>
        <CourseCard
            key={item._doc._id}
            id={item._doc._id}
            title ={item._doc.title}
            imageUrl ={item._doc.imageUrl}
            chaptersLength ={item._doc.chapters.length}
            price ={item._doc.price}
            progress={item.progress}
            category ={item?._doc?.category?.name}
        />
        ))}
      </div>
      {items.length === 0  &&(
        <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found 
        </div>
      )}
    </div>
  );
}

// [
//     {
//       '$__': InternalCache {
//         activePaths: [StateMachine],
//         skipId: true,
//         populated: [Object]
//       },
//       '$isNew': false,
//       _doc: {
//         _id: new ObjectId('662049c914741f30bb7f39db'),   
//         userId: 'user_2fSaFFG5jaEGK2BMFwuXCOEpwQa',      
//         title: 'updated courseV3.1',
//         isPublished: true,
//         attachments: [Array],
//         createdAt: 2024-04-17T22:14:33.134Z,
//         updatedAt: 2024-05-07T16:27:43.443Z,
//         __v: 54,
//         description: 'this my course description.0.1',   
//         imageUrl: 'https://utfs.io/f/3220a8ee-8a5b-439f-b461-66361d2150fc-jlo1ag.png',
//         category: [Object],
//         price: 99.99,
//         chapters: [Array],
//         purchases: []
//       },
//       progress: null
//     }
//   ]