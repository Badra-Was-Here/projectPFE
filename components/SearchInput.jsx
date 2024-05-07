"use client"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/UseDebounce";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";

export default function SearchInput() {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500);

    const searchParams = new URLSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const currentCategoryId = searchParams.get("categoryId");
    
    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: debouncedValue,
                categoryId: currentCategoryId,
            }
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
          <Search className="h-4 w-4 top-3 absolute left-3 text-slate-600" />
            <Input 
                onChange = {(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for a course"
            />
    </div>
  )
}
