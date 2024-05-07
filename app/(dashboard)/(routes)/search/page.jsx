import connectMongoDB from "@/lib/mongodb"
import Category from "@/models/category"
import Categories from "./_components/Categories";

export default async function SearchPage() {
  
  await connectMongoDB();
  const categories = await Category.find().sort({name:1});

  console.log(categories)
  return (
    <div className="p-6">
      <Categories
        items={categories}
      />
    </div>
  )
}
